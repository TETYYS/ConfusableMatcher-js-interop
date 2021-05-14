import type { IIndexOfOptions, IResult, Mapping, StrPosPointer } from '..';
import { ConfusableMatcher, EReturnStatus } from '..';

const map: Mapping[] = [['Z', 'Ž']];
const skips: string[] = [' ', '_', '-'];
const cm = new ConfusableMatcher(map, skips, true);

const input =
    'Žebras are a short, stocky animal that is generally about 8 feet long and stands between 4 and 5 feet at the shoulder.';
const needle = 'Zebras';

let strPosPtrs: StrPosPointer | undefined = cm.computeStringPosPointers(needle);

const options: Partial<IIndexOfOptions> = {
    matchOnWordBoundary: true,
    matchRepeating: true,
    needlePosPointers: strPosPtrs,
    startFromEnd: false,
    startIndex: 0,
    statePushLimit: 10_000,
};
const result: IResult = cm.indexOfSync(input, needle, options);

cm.freeStringPosPointers(strPosPtrs);
strPosPtrs = undefined;
delete options.needlePosPointers;

const status: EReturnStatus = result.status;
console.table({ ...result, status: EReturnStatus[status] });
