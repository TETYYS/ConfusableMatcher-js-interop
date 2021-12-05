import type Benchmark from 'benchmark';

import type { ConfusableMatcher } from '../../wrapper';
import type { ConfigureFn } from '../bench';

export const configure: ConfigureFn = (suite: Benchmark.Suite, cm: ConfusableMatcher) => {
    suite.add('ConfusableMatcher#indexOfDebugFailuresSync', () =>
        cm.indexOfDebugFailuresSync('SIMP', 'SINP', { matchOnWordBoundary: true, matchRepeating: true })
    );
};
