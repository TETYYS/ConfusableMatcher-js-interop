import type { IBenchmarkOptions } from './options';
import { DEFAULTS, OPTION_MAP } from './options';

export function parse(args: string[] = process.argv.slice(2)): IBenchmarkOptions {
    const opts = { ...DEFAULTS };
    for (const arg of args) {
        if (arg in OPTION_MAP) {
            opts[OPTION_MAP[arg]] = true;
        }
    }
    return opts;
}
