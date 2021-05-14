import type Benchmark from 'benchmark';

// import { assert } from 'console';
import type { ConfusableMatcher } from '../../wrapper';
import type { ConfigureFn } from '../bench';

let ptr: number;

export const configure: ConfigureFn = (suite: Benchmark.Suite, cm: ConfusableMatcher) => {
    suite.add('ConfusableMatcher#indexOf (StrPosPointers)', {
        defer: true,
        fn: (defer: Benchmark.Deferred) => {
            // assert(ptr !== undefined);
            cm.indexOf('SIMP', 'SIMP', {
                matchOnWordBoundary: true,
                matchRepeating: true,
                needlePosPointers: ptr,
            }).finally(() => defer.resolve());
        },
        onComplete: () => cm.freeStringPosPointers(ptr),
        onStart: () => (ptr = cm.computeStringPosPointers('SIMP')),
    });
};
