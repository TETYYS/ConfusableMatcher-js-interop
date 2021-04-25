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
    private readonly _map: Mapping[] = [];
    private readonly _skips: Set<string>;

    private _instance!: ConfusableMatcherInstance;

    public constructor(map: Mapping[] = [], skips: Iterable<string> = [], addDefaultValues = true) {
        if (map.length) {
            for (const [key, value] of map) {
                this._addMap(key, value);
            }
        }

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
            for (const space of spaces) {
                this._addMap(' ', space);
            }

            for (let c = 'A'.charCodeAt(0); c <= 'Z'.charCodeAt(0); c++) {
                const lc = String.fromCharCode(c);
                const uc = String.fromCharCode(c + 0x20);
                this._addMap(lc, lc);
                this._addMap(lc, uc);
                this._addMap(uc, uc);
                this._addMap(uc, lc);
            }

            for (let c = '0'.charCodeAt(0); c <= '9'.charCodeAt(0); c++) {
                const char = String.fromCharCode(c);
                this._addMap(char, char);
            }
        }

        this._rebuildInstance();
    }

    //#region Mappings
    public addMapping(key: string, value: string): void {
        this._addMap(key, value);
        this._rebuildInstance();
    }

    public addMappings(mappings: Iterable<Mapping>): void {
        for (const [key, value] of mappings) {
            this._addMap(key, value);
        }

        this._rebuildInstance();
    }

    public removeMapping(key: string, value: string): void {
        if (key.length === 0) {
            throw new Error('Key provided is empty.');
        }
        if (key[0] == '\x00' || key[0] == '\x01') {
            throw new Error('Key cannot begin with \\x00 or \\x01');
        }
        if (value.length === 0) {
            throw new Error('Value provided is empty.');
        }
        if (value[0] == '\x00' || value[0] == '\x01') {
            throw new Error('Value cannot begin with \\x00 or \\x01');
        }

        let didRemove = false;
        for (let i = 0; i < this._map.length; i++) {
            const mapping = this._map[i];
            if (mapping[0] !== key) {
                continue;
            }
            if (mapping[1] !== value) {
                continue;
            }
            this._map.splice(i, 1);
            didRemove = true;
            break;
        }

        if (didRemove) {
            this._rebuildInstance();
        }
    }

    /**
     * @TODO
     * O(m * n)
     */
    public removeMappings(mappings: Mapping[]): void {
        if (mappings.length < 1) {
            throw new Error('At least one mapping must be provided.');
        }

        let didRemoveAny = false;
        for (const [key, value] of mappings) {
            if (key.length === 0) {
                throw new Error('Mapping key provided is empty.');
            }
            if (key[0] == '\x00' || key[0] == '\x01') {
                throw new Error('Mapping key cannot begin with \\x00 or \\x01');
            }
            if (value.length === 0) {
                throw new Error('Mapping value provided is empty.');
            }
            if (value[0] == '\x00' || value[0] == '\x01') {
                throw new Error('Mapping value cannot begin with \\x00 or \\x01');
            }

            for (let i = 0; i < this._map.length; i++) {
                const mapping = this._map[i];
                if (mapping[0] !== key) {
                    continue;
                }
                if (mapping[1] !== value) {
                    continue;
                }
                this._map.splice(i, 1);
                didRemoveAny = true;
                break;
            }
        }

        if (didRemoveAny) {
            this._rebuildInstance();
        }
    }

    public getMappings(): Mapping[] {
        return this._map;
    }

    public getKeyMappings(key: string): string[] {
        if (key.length === 0) {
            throw new Error('Key provided is empty.');
        }
        if (key[0] == '\x00' || key[0] == '\x01') {
            throw new Error('Key cannot begin with \\x00 or \\x01');
        }

        return this._instance.getKeyMappings(key);
    }
    //#endregion Mappings

    //#region Skips
    public addSkip(skip: string): void {
        if (skip.length === 0) {
            throw new Error('Skip provided is empty.');
        }
        if (skip[0] == '\x00' || skip[0] == '\x01') {
            throw new Error('Skip cannot begin with \\x00 or \\x01');
        }

        this._skips.add(skip);
        this._rebuildInstance();
    }

    public addSkips(skips: string[]): void {
        for (const skip of skips) {
            if (skip.length === 0) {
                throw new Error('Skip provided is empty.');
            }
            if (skip[0] == '\x00' || skip[0] == '\x01') {
                throw new Error('Skip cannot begin with \\x00 or \\x01');
            }

            this._skips.add(skip);
        }

        this._rebuildInstance();
    }

    public removeSkip(skip: string): void {
        if (skip.length === 0) {
            throw new Error('Skip provided is empty.');
        }
        if (skip[0] == '\x00' || skip[0] == '\x01') {
            throw new Error('Skip cannot begin with \\x00 or \\x01');
        }

        const didRemove = this._skips.delete(skip);
        if (didRemove) {
            this._rebuildInstance();
        }
    }

    /**
     *
     */
    public removeSkips(skips: string[]): void {
        if (skips.length < 1) {
            throw new Error('At least one skip must be provided.');
        }

        let didRemoveAny = false;
        for (const skip of skips) {
            if (skip.length === 0) {
                throw new Error('Skip provided is empty.');
            }
            if (skip[0] == '\x00' || skip[0] == '\x01') {
                throw new Error('Skip cannot begin with \\x00 or \\x01');
            }
            const didRemove = this._skips.delete(skip);
            if (didRemove && !didRemoveAny) {
                didRemoveAny = true;
            }
        }

        if (didRemoveAny) {
            this._rebuildInstance();
        }
    }

    public indexOf(input: string, needle: string, options?: Partial<IIndexOfOptions>): IResult {
        const result = this._instance.indexOf(input, needle, this._fillDefaultOptions(options));

        switch (result.status) {
            case EReturnStatus.MATCH:
                return result;
            case EReturnStatus.NO_MATCH:
                return result;
            // throw new Error();
            case EReturnStatus.STATE_PUSH_LIMIT_EXCEEDED:
                return result;
            // throw new Error();
            case EReturnStatus.WORD_BOUNDARY_FAIL_END:
                return result;
            case EReturnStatus.WORD_BOUNDARY_FAIL_START:
                return result;
            // throw new Error();
        }
    }

    public contains(input: string, needle: string, options?: IIndexOfOptions): boolean {
        return this._instance.indexOf(input, needle, this._fillDefaultOptions(options)).start > -1;
    }

    private _addMap(key: string, value: string) {
        if (key.length === 0) {
            throw new Error('Key provided is empty.');
        }
        if (key[0] == '\x00' || key[0] == '\x01') {
            throw new Error('Key cannot begin with \\x00 or \\x01');
        }
        if (value.length === 0) {
            throw new Error('Value provided is empty.');
        }
        if (value[0] == '\x00' || value[0] == '\x01') {
            throw new Error('Value cannot begin with \\x00 or \\x01');
        }

        this._map.push([key, value]);
    }

    private _rebuildInstance(): void {
        this._instance = new ConfusableMatcherInterop([...this._map.values()], [...this._skips.values()], false);
    }

    private _fillDefaultOptions(options?: Partial<IIndexOfOptions>): IIndexOfOptions {
        return Object.assign<IIndexOfOptions, Partial<IIndexOfOptions> | undefined>({ ...DEFAULT_OPTIONS }, options);
    }
}
