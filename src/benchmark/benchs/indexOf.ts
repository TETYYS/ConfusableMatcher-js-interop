import type Benchmark from 'benchmark';

import type { ConfusableMatcher } from '../../wrapper';
import type { ConfigureFn } from '../bench';

export const configure: ConfigureFn = (suite: Benchmark.Suite, cm: ConfusableMatcher) => {
    suite.add(
        'ConfusableMatcher#indexOf',
        (defer: Benchmark.Deferred) => {
            cm.indexOf('SIMP', 'SIMP', { matchOnWordBoundary: true, matchRepeating: true }).finally(() =>
                defer.resolve()
            );
        },
        { defer: true }
    );
};
