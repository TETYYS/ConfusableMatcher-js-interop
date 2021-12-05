/* cSpell: disable */
import Benchmark from 'benchmark';

import { ConfusableMatcher } from '../';
import * as indexOf from './benchs/indexOf';
import * as indexOfDebugFailures from './benchs/indexOfDebugFailures';
import * as indexOfDebugFailuresEx from './benchs/indexOfDebugFailuresEx';
import * as indexOfDebugFailuresExSync from './benchs/indexOfDebugFailuresExSync';
import * as indexOfDebugFailuresSync from './benchs/indexOfDebugFailuresSync';
import * as indexOfStrPosPointers from './benchs/indexOfStrPosPointers';
import * as indexOfSync from './benchs/indexOfSync';
import * as indexOfSyncStrPosPointers from './benchs/indexOfSyncStrPosPointers';
import { parse } from './parser';
import * as loopLatency from './perf/loop-latency';
import * as microtasks from './perf/microtasks';

const options = parse();
if (options.loop) {
    loopLatency.start(500);
}
if (options.microtasks) {
    microtasks.start();
}
const suite = new Benchmark.Suite();
suite.on('cycle', (event: Benchmark.Event) => console.log(event.target.toString()));
suite.on('complete', () => console.log('Fastest is ' + suite.filter('fastest').map('name').toString()));
const matcher = new ConfusableMatcher();
[
    indexOf.configure,
    indexOfStrPosPointers.configure,
    indexOfSync.configure,
    indexOfSyncStrPosPointers.configure,
    indexOfDebugFailures.configure,
    indexOfDebugFailuresEx.configure,
    indexOfDebugFailuresExSync.configure,
    indexOfDebugFailuresSync.configure,
].forEach((fn) => fn(suite, matcher));
console.log('Running benchmark...');
suite.run({ async: true });
