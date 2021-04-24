import type { ConfusableMatcherNapiInterop, ICMMapping, ICMOptions } from './binding';
import ConfusableMatcherInterop from './binding';

export interface IResult {
    index: number;
    len: number;
}

export class ConfusableMatcher {
    private _instance: ConfusableMatcherNapiInterop;
    private _map: ICMMapping[];
    private readonly _skips: Set<string>;

    public constructor(map: ICMMapping[] = [], skips: Iterable<string> = [], addDefaultValues = true) {
        this._map = [];
        if (map.length) {
            for (const [key, value] of map) {
                this._map.push([key.toLocaleUpperCase(), value.toLocaleUpperCase()]);
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
                '﻿',
            ];
            for (const space of spaces) {
                this._map.push([' ', space]);
            }

            for (let c = 'A'.charCodeAt(0); c <= 'Z'.charCodeAt(0); c++) {
                const lc = String.fromCharCode(c);
                const uc = String.fromCharCode(c + 0x20);
                this._map.push([lc, lc]);
                this._map.push([lc, uc]);
                this._map.push([uc, uc]);
                this._map.push([uc, lc]);
            }

            for (let c = '0'.charCodeAt(0); c <= '9'.charCodeAt(0); c++) {
                const char = String.fromCharCode(c);
                this._map.push([char, char]);
            }
        }

        this._instance = new ConfusableMatcherInterop.ConfusableMatcherNapiInterop([], [], false);
        for (const [key, value] of this._map) {
            this._instance.AddMapping(key, value, true);
        }
        for (const skip of this._skips.values()) {
            this._instance.AddSkip(skip);
        }
    }

    public addMapping(key: string, value: string, checkValueDuplicate = true): void {
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

        key = key.toLocaleUpperCase();
        value = value.toLocaleUpperCase();

        const didAdd = this._instance.AddMapping(key, value, checkValueDuplicate);
        if (didAdd) {
            this._map.push([key, value]);
        }
    }

    public addMappings(mappings: ICMMapping[], checkValueDuplicate = true): void {
        for (const [key, value] of mappings) {
            this.addMapping(key, value, checkValueDuplicate);
        }
    }

    public expandMappings(): void {
        for (const [key, value] of this._map) {
            const cps = [...value];

            if (cps.every((x) => x.charCodeAt(0) < 255) && cps.length >= 2 && cps.length <= 4) {
                const add = (baseValue: string, constructed: string) => {
                    if (baseValue.length == 0) {
                        this._map.push([key, constructed]);
                        return;
                    }

                    const vals = this._instance.GetKeyMappings(baseValue[0]);
                    for (const val of vals) {
                        add(baseValue.slice(1), constructed + val);
                    }
                };

                add(value, '');
            }
        }
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

        key = key.toLocaleUpperCase();
        value = value.toLocaleUpperCase();

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
            this._instance = new ConfusableMatcherInterop.ConfusableMatcherNapiInterop([], [], false);
            for (const [key, value] of this._map) {
                this._instance.AddMapping(key, value, true);
            }
            for (const skip of this._skips.values()) {
                this._instance.AddSkip(skip);
            }
        } else {
            throw new Error('Mapping does not exist.');
        }
    }

    /**
     * @TODO
     * O(m * n)
     */
    public removeMappings(mappings: ICMMapping[]): void {
        if (mappings.length < 1) {
            throw new Error('At least one mapping must be provided.');
        }

        let didRemoveAny = false;
        for (let [key, value] of mappings) {
            if (key.length === 0) {
                throw new Error('Mapping key provided is empty.');
            }
            if (key[0] == '\x00' || key[0] == '\x01') {
                throw new Error('Key cannot begin with \\x00 or \\x01');
            }
            if (value.length === 0) {
                throw new Error('Mapping value provided is empty.');
            }
            if (value[0] == '\x00' || value[0] == '\x01') {
                throw new Error('Value cannot begin with \\x00 or \\x01');
            }

            key = key.toLocaleUpperCase();
            value = value.toLocaleUpperCase();

            for (let i = 0; i < this._map.length; i++) {
                const mapping = this._map[i];
                if (mapping[0] !== key) {
                    continue;
                }
                if (mapping[1] !== value) {
                    continue;
                }
                this._map.splice(i, 1);
                if (!didRemoveAny) {
                    didRemoveAny = true;
                }
                break;
            }
        }

        if (didRemoveAny) {
            this._instance = new ConfusableMatcherInterop.ConfusableMatcherNapiInterop([], [], false);
            for (const [key, value] of this._map) {
                this._instance.AddMapping(key, value, true);
            }
            for (const skip of this._skips.values()) {
                this._instance.AddSkip(skip);
            }
        } else {
            throw new Error('A mapping does not exist.');
        }
    }

    public *getMappings(): IterableIterator<ICMMapping> {
        for (const mapping of this._map) {
            yield mapping;
        }
    }

    public getMappingsForKey(key: string): string[] {
        if (key.length === 0) {
            throw new Error('Key provided is empty.');
        }
        if (key[0] == '\x00' || key[0] == '\x01') {
            throw new Error('Key cannot begin with \\x00 or \\x01');
        }

        key = key.toLocaleUpperCase();

        return this._instance.GetKeyMappings(key);
    }

    public addSkip(skip: string): void {
        if (skip.length === 0) {
            throw new Error('Skip provided is empty.');
        }
        if (skip[0] == '\x00' || skip[0] == '\x01') {
            throw new Error('Skip cannot begin with \\x00 or \\x01');
        }

        skip = skip.toLocaleUpperCase();

        const didAdd = this._instance.AddSkip(skip);
        if (didAdd) {
            this._skips.add(skip);
        } else {
            throw new Error('Skip does not exist.');
        }
    }

    public addSkips(skips: string[]): void {
        for (const skip of skips) {
            this.addSkip(skip);
        }
    }

    public removeSkip(skip: string): void {
        if (skip.length === 0) {
            throw new Error('Skip provided is empty.');
        }
        if (skip[0] == '\x00' || skip[0] == '\x01') {
            throw new Error('Skip cannot begin with \\x00 or \\x01');
        }

        skip = skip.toLocaleUpperCase();

        const didRemove = this._skips.delete(skip);
        if (didRemove) {
            this._instance = new ConfusableMatcherInterop.ConfusableMatcherNapiInterop([], [], false);
            for (const [key, value] of this._map) {
                this._instance.AddMapping(key, value, true);
            }
            for (const skip of this._skips.values()) {
                this._instance.AddSkip(skip);
            }
        } else {
            throw new Error('Skip does not exist.');
        }
    }

    /**
     * @TODO
     * O(m * n)
     */
    public removeSkips(skips: string[]): void {
        if (skips.length < 1) {
            throw new Error('At least one skip must be provided.');
        }

        let didRemoveAny = false;
        for (let skip of skips) {
            if (skip.length === 0) {
                throw new Error('Skip provided is empty.');
            }
            if (skip[0] == '\x00' || skip[0] == '\x01') {
                throw new Error('Skip cannot begin with \\x00 or \\x01');
            }
            skip = skip.toLocaleUpperCase();
            const didRemove = this._skips.delete(skip);
            if (didRemove && !didRemoveAny) {
                didRemoveAny = true;
            }
        }

        if (didRemoveAny) {
            this._instance = new ConfusableMatcherInterop.ConfusableMatcherNapiInterop([], [], false);
            for (const [key, value] of this._map) {
                this._instance.AddMapping(key, value, true);
            }
            for (const skip of this._skips.values()) {
                this._instance.AddSkip(skip);
            }
        } else {
            throw new Error('An skip does not exist.');
        }
    }

    public getSkips(): IterableIterator<string> {
        return this._skips.values();
    }

    public indexOf(input: string, needle: string, options?: Partial<ICMOptions>): IResult {
        input = input.toLocaleUpperCase();
        needle = needle.toLocaleUpperCase();

        const r = this._instance.IndexOf(input, needle, this._fillDefaultOptions(options));
        return { index: r.Index, len: r.Length };
    }

    public contains(input: string, needle: string, options?: ICMOptions): boolean {
        input = input.toLocaleUpperCase();
        needle = needle.toLocaleUpperCase();

        const r = this._instance.IndexOf(input, needle, this._fillDefaultOptions(options));
        return r.Index > -1;
    }

    private _fillDefaultOptions(options?: Partial<ICMOptions>): ICMOptions {
        return Object.assign<ICMOptions, Partial<ICMOptions> | undefined>(
            {
                matchOnWordBoundary: false,
                matchRepeating: true,
                startFromEnd: false,
                startIndex: 0,
                statePushLimit: 1000,
            },
            options
        );
    }
}
