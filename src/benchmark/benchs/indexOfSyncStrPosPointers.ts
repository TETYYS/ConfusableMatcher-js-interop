import type Benchmark from 'benchmark';

// import { assert } from 'console';
import type { ConfusableMatcher } from '../../wrapper';
import type { ConfigureFn } from '../bench';

let ptr: number;

export const configure: ConfigureFn = (suite: Benchmark.Suite, cm: ConfusableMatcher) => {
    suite.add('ConfusableMatcher#indexOfSync (StrPosPointers)', {
        fn: () => {
            // assert(ptr !== undefined);
            cm.indexOfSync('SIMP', 'SIMP', {
                matchOnWordBoundary: true,
                matchRepeating: true,
                needlePosPointers: ptr,
            });
        },
        onComplete: () => cm.freeStringPosPointers(ptr),
        onStart: () => (ptr = cm.computeStringPosPointers('SIMP')),
    });
};
