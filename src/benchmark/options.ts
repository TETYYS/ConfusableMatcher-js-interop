export interface IBenchmarkOptions {
    loop: boolean;
    microtasks: boolean;
}

/* eslint-disable sort-keys, sort-keys-fix/sort-keys-fix */
export const OPTION_MAP: Record<string, keyof IBenchmarkOptions> = {
    '-l': 'loop',
    '--loop': 'loop',
    '-m': 'microtasks',
    '--microtasks': 'microtasks',
};
/* eslint-enable sort-keys, sort-keys-fix/sort-keys-fix */

export const DEFAULTS: Readonly<IBenchmarkOptions> = {
    loop: false,
    microtasks: false,
};
