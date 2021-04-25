import type { ConfusableMatcherInstance, IIndexOfOptions, IResult, Mapping } from './binding';
import { ConfusableMatcherInterop, EReturnStatus } from './binding';

const DEFAULT_OPTIONS: IIndexOfOptions = {
    matchOnWordBoundary: false,
    matchRepeating: true,
    startFromEnd: false,
    startIndex: 0,
    statePushLimit: 1000,
};

export class ConfusableMatcher {
    private readonly _maps: Mapping[];
    private readonly _skips: Set<string>;

    private _instance!: ConfusableMatcherInstance;

    public constructor(maps: Mapping[] = [], skips: Iterable<string> = [], addDefaultValues = true) {
        this._maps = maps;
        this._skips = new Set(skips);

        if (addDefaultValues) {
            const spaces = [
                ' ',
                '\u00A0',
                '᠎',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                '​',
                ' ',
                ' ',
                '　',
            ];
            this._addMappings(
                spaces.map((s) => [' ', s]),
                false
            );

            for (let c = 'A'.charCodeAt(0); c <= 'Z'.charCodeAt(0); c++) {
                const lc = String.fromCharCode(c);
                const uc = String.fromCharCode(c + 0x20);
                this._addMappings(
                    [
                        [lc, lc],
                        [lc, uc],
                        [uc, uc],
                        [uc, lc],
                    ],
                    false
                );
            }

            for (let c = '0'.charCodeAt(0); c <= '9'.charCodeAt(0); c++) {
                const char = String.fromCharCode(c);
                this._addMappings([[char, char]], false);
            }
        }

        this._rebuildInstance();
    }

    //#region Mappings
    public addMapping(key: string, value: string): void {
        this._addMappings([[key, value]], true);
    }

    public addMappings(mappings: Iterable<Mapping>): void {
        this._addMappings(mappings, true);
    }

    public removeMapping(key: string, value: string): void {
        this._removeMappings([[key, value]], true);
    }

    public removeMappings(mappings: Mapping[]): void {
        this._removeMappings(mappings, true);
    }

    public getMappings(): Mapping[] {
        return this._maps;
    }

    public getKeyMappings(value: string): string[] {
        this._validateValue(value, 'Value');
        return this._instance.getKeyMappings(value);
    }
    //#endregion Mappings

    //#region Skips
    public addSkip(skip: string): void {
        this._addSkips([skip], true);
    }

    public addSkips(skips: string[]): void {
        this._addSkips(skips, true);
    }

    public removeSkip(skip: string): void {
        this._removeSkips([skip], true);
    }

    public removeSkips(skips: string[]): void {
        this._removeSkips(skips, true);
    }
    //#endregion Skips

    //#region Comparators
    public indexOf(input: string, needle: string, options?: Partial<IIndexOfOptions>): IResult {
        return this._instance.indexOf(input, needle, this._fillDefaultOptions(options));
    }

    public contains(input: string, needle: string, options?: IIndexOfOptions): boolean {
        const result = this._instance.indexOf(input, needle, this._fillDefaultOptions(options));
        return result.status === EReturnStatus.MATCH;
    }
    //#endregion Comparators

    private _validateValue(value: string, name: string): void {
        if (value.length === 0) {
            throw new Error(`${name} cannot be empty.`);
        }
        if (value[0] == '\x00' || value[0] == '\x01') {
            throw new Error(String.raw`${name} cannot start with \x00 or \x01.`);
        }
    }

    private _addMappings(mappings: Iterable<Mapping>, rebuild: boolean): void {
        for (const [key, value] of mappings) {
            this._validateValue(key, 'Key');
            this._validateValue(value, 'Value');
            this._maps.push([key, value]);
        }

        if (rebuild) {
            this._rebuildInstance();
        }
    }

    private _removeMappings(mappings: Iterable<Mapping>, rebuild: boolean) {
        let didRemoveAny = false;
        for (const [key, value] of mappings) {
            this._validateValue(key, 'Key');
            this._validateValue(value, 'Value');

            for (let i = 0; i < this._maps.length; i++) {
                const mapping = this._maps[i];
                if (mapping[0] !== key) {
                    continue;
                }
                if (mapping[1] !== value) {
                    continue;
                }
                this._maps.splice(i, 1);
                didRemoveAny = true;
                break;
            }
        }

        if (didRemoveAny && rebuild) {
            this._rebuildInstance();
        }
    }

    private _addSkips(skips: string[], rebuild: boolean): void {
        for (const skip of skips) {
            this._validateValue(skip, 'Skip');
            this._skips.add(skip);
        }

        if (rebuild) {
            this._rebuildInstance();
        }
    }

    private _removeSkips(skips: string[], rebuild: boolean): void {
        let didRemoveAny = false;
        for (const skip of skips) {
            this._validateValue(skip, 'Skip');

            if (this._skips.delete(skip)) {
                didRemoveAny = true;
            }
        }

        if (didRemoveAny && rebuild) {
            this._rebuildInstance();
        }
    }

    private _rebuildInstance(): void {
        this._instance = new ConfusableMatcherInterop([...this._maps.values()], [...this._skips.values()], false);
    }

    private _fillDefaultOptions(options?: Partial<IIndexOfOptions>): IIndexOfOptions {
        return Object.assign<IIndexOfOptions, Partial<IIndexOfOptions> | undefined>({ ...DEFAULT_OPTIONS }, options);
    }
}
