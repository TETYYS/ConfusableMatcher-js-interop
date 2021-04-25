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

    /**
     * @internal
     * @description C++ NAPI Object Reference
     */
    private _instance!: ConfusableMatcherInstance;

    /**
     * @param maps An array of [Key, Value] tuples. A key is the character to look for, a value is the resulting map.
     * @param skips An iterable of characters to skip.
     * @param addDefaultValues Whether to add ASCII characters and spaces to the map.
     */
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
    /**
     * @description Adds a single map.
     * @param key The value to look for.
     * @param value The replacement value.
     */
    public addMapping(key: string, value: string): void {
        this._addMappings([[key, value]], true);
    }

    /**
     * @description Adds multiples maps.
     * @param mappings An array of [Key, Value] tuples. A key is the character to look for, a value is the resulting map.
     */
    public addMappings(mappings: Iterable<Mapping>): void {
        this._addMappings(mappings, true);
    }

    /**
     * @description Removes a single map.
     * @param key The value to look for.
     * @param value The replacement value.
     */
    public removeMapping(key: string, value: string): void {
        this._removeMappings([[key, value]], true);
    }

    /**
     * @description Removes multiples maps.
     * @param mappings An array of [Key, Value] tuples. A key is the character to look for, a value is the resulting map.
     */
    public removeMappings(mappings: Mapping[]): void {
        this._removeMappings(mappings, true);
    }

    /**
     * @returns An array of maps.
     */
    public getMappings(): Mapping[] {
        return this._maps;
    }

    /**
     * @returns Map key's for a value.
     */
    public getKeyMappings(value: string): string[] {
        this._validateValue(value, 'Value');
        return this._instance.getKeyMappings(value);
    }
    //#endregion Mappings

    //#region Skips
    /**
     * @description Adds a single skip.
     * @param skip The value to skip.
     */
    public addSkip(skip: string): void {
        this._addSkips([skip], true);
    }

    /**
     * @description Adds multiple skips.
     * @param skips An array of values to skip.
     */
    public addSkips(skips: string[]): void {
        this._addSkips(skips, true);
    }

    /**
     * @description Removes a single skip.
     * @param skip The skip value to remove.
     */
    public removeSkip(skip: string): void {
        this._removeSkips([skip], true);
    }

    /**
     * @description Removes multiple skips.
     * @param skips An array of skip values to remove.
     */
    public removeSkips(skips: string[]): void {
        this._removeSkips(skips, true);
    }

    /**
     * @returns An array of skips.
     */
    public getSkips(): string[] {
        return [...this._skips];
    }
    //#endregion Skips

    //#region Comparators
    /**
     * @description Searches for the first occurrence of `needle` in `input`.
     * @param input The string to search.
     * @param needle The string to look for in `input`.
     * @param options An optional object containing options in the search.
     * @returns An object containing match information.
     */
    public indexOf(input: string, needle: string, options?: Partial<IIndexOfOptions>): IResult {
        return this._instance.indexOf(input, needle, this._fillDefaultOptions(options));
    }

    /**
     * @description Searches for the last occurrence of `needle` in `input`.
     * @param input The string to search.
     * @param needle The string to look for in `input`.
     * @param options An optional object containing options in the search.
     * @returns An object containing match information.
     */
    public lastIndexOf(
        input: string,
        needle: string,
        options?: Omit<Partial<IIndexOfOptions>, 'startFromEnd'>
    ): IResult {
        return this._instance.indexOf(
            input,
            needle,
            this._fillDefaultOptions({
                ...options,
                startFromEnd: true,
                startIndex: input.length - 1,
            })
        );
    }

    /**
     * @param input The string to search.
     * @param needle The string to look for in `input`.
     * @param options An optional object containing options in the search.
     * @returns True if the `needle` is found inside `input`.
     */
    public contains(input: string, needle: string, options?: IIndexOfOptions): boolean {
        const result = this._instance.indexOf(input, needle, this._fillDefaultOptions(options));
        return result.status === EReturnStatus.MATCH;
    }
    //#endregion Comparators

    /**
     * @description Validates whether a `value` can be used in the confusable matcher instance.
     * @param value The value to check.
     * @param name The parameter name of the value.
     */
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

    /**
     * @description Constructs a new instance of the NAPI ConfusableMatcher interop and updates the JavaScript reference.
     */
    private _rebuildInstance(): void {
        this._instance = new ConfusableMatcherInterop([...this._maps], [...this._skips], false);
    }

    /**
     * @description Pre-fills default search options.
     */
    private _fillDefaultOptions(options?: Partial<IIndexOfOptions>): IIndexOfOptions {
        return Object.assign<IIndexOfOptions, Partial<IIndexOfOptions> | undefined>({ ...DEFAULT_OPTIONS }, options);
    }
}
