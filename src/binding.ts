// test build
export type Mapping = [key: string, value: string];

export enum EReturnStatus {
    MATCH = 0,
    NO_MATCH = 1,
    TIMEOUT = 2,
    WORD_BOUNDARY_FAIL_START = 3,
    WORD_BOUNDARY_FAIL_END = 4,
}

export interface IResult {
    size: number;
    start: number;
    status: EReturnStatus;
}

export interface IIndexOfOptions {
    matchRepeating: boolean;
    startIndex: number;
    startFromEnd: boolean;
    timeoutNs: number;
    matchOnWordBoundary: boolean;
    needlePosPointers: StrPosPointer | null;
}

declare const K_STR_POS_PTRS: unique symbol;
export type StrPosPointer = object & { [K_STR_POS_PTRS]: true };

export declare class ConfusableMatcherInstance {
    getKeyMappings(value: string): string[];
    computeStringPosPointers(needle: string): StrPosPointer;
    freeStringPosPointers(pointer: StrPosPointer): void;
    indexOf(input: string, needle: string, options?: IIndexOfOptions): IResult;
    indexOfAsync(callback: (result: IResult) => void, input: string, needle: string, options?: IIndexOfOptions): void;
}

interface IConfusableMatcherProptotype {
    new (maps: string[][], skips: string[], addDefaultValues: boolean): ConfusableMatcherInstance;
}

interface IAddonExports {
    ConfusableMatcher: IConfusableMatcherProptotype;
}

// eslint-disable-next-line import/no-mutable-exports
let classExport: IConfusableMatcherProptotype;

const ADDON_PATHS = [
    '../Release/confusablematcher-js-interop-native',
    '../build/Release/confusablematcher-js-interop-native',
];
for (const path of ADDON_PATHS) {
    try {
        const module = require(path) as IAddonExports;
        classExport = module.ConfusableMatcher;
        break;
    } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (e?.code !== 'MODULE_NOT_FOUND') {
            throw e;
        }
    }
}

export { classExport as ConfusableMatcherInterop };
// eslint-disable-next-line import/no-default-export
export default classExport!;
