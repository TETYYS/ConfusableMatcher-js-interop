import type Benchmark from 'benchmark';

import type { ConfusableMatcher } from '../wrapper';

export type ConfigureFn = (suite: Benchmark.Suite, cm: ConfusableMatcher) => void;
