declare interface IConfusableMatcherNapiInterop {
    new (map: string[][], skip: string[], addDefaultValues: boolean): ConfusableMatcherNapiInterop;
}

export interface ICMView {
    Index: number;
    Length: number;
}

export type ICMMapping = [key: string, value: string];

export enum ECMFailCode {
    NO_MATCH = -1,
    EXCEEDED_STATE_PUSH_LIMIT = -2,
    WORD_BOUNDARY_FAIL_START = -3,
    WORD_BOUNDARY_FAIL_END = -4,
}

export interface ICMOptions {
    matchRepeating: boolean;
    startIndex: number;
    startFromEnd: boolean;
    statePushLimit: number;
    matchOnWordBoundary: boolean;
}

export declare abstract class ConfusableMatcherNapiInterop {
    AddMapping(key: string, value: string, checkValueDuplicate: boolean): boolean;
    AddSkip(value: string): boolean;
    GetKeyMappings(key: string): string[];
    IndexOf(input: string, needle: string, options: ICMOptions): ICMView;
}

declare interface IAddonExports {
    ConfusableMatcherNapiInterop: IConfusableMatcherNapiInterop;
}

// eslint-disable-next-line  @typescript-eslint/naming-convention
let ConfusableMatcherNapi: IAddonExports;

const ADDON_PATHS = [
    '../Release/confusablematcher-js-interop-native',
    '../build/Release/confusablematcher-js-interop-native',
];
for (const path of ADDON_PATHS) {
    try {
        ConfusableMatcherNapi = require(path) as IAddonExports;
        break;
    } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (e?.code !== 'MODULE_NOT_FOUND') {
            throw e;
        }
    }
}

// eslint-disable-next-line import/no-default-export
export default ConfusableMatcherNapi!;
