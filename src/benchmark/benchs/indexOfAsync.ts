import type Benchmark from 'benchmark';

import type { ConfusableMatcher } from '../../wrapper';
import type { ConfigureFn } from '../bench';

export const configure: ConfigureFn = (suite: Benchmark.Suite, cm: ConfusableMatcher) => {
    suite.add(
        'ConfusableMatcher#indexOfAsync',
        (defer: Benchmark.Deferred) => {
            cm.indexOfAsync('SIMP', 'SIMP', { matchOnWordBoundary: true, matchRepeating: true }).finally(() =>
                defer.resolve()
            );
        },
        { defer: true }
    );
};
