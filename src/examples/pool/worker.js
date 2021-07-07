const { parentPort } = require('worker_threads');
const { ConfusableMatcher } = require('../../../build/src');

const matcher = new ConfusableMatcher([], [], true);
let completed = 0;
while (true) {
    matcher.indexOfSync('SIMP', 'SIMP', { matchOnWordBoundary: true, matchRepeating: true });
    if (++completed > 10000) {
        completed = 0;
        parentPort.postMessage(null);
    }
}
