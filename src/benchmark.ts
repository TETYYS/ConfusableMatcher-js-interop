import Benchmark from 'benchmark';

import { ConfusableMatcher } from './wrapper';

const suite = new Benchmark.Suite();
const cm = new ConfusableMatcher([], [], true);

suite.add('ConfusableMatcher#indexOf', () =>
    cm.indexOf('SIMP', 'SIMP', {
        matchOnWordBoundary: true,
        matchRepeating: true,
    })
);
suite.on('cycle', (event: Benchmark.Event) => console.log(event.target.toString()));
console.log('Running benchmark...');
suite.run({ async: true });
