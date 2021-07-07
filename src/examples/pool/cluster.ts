import * as os from 'os';
import * as path from 'path';
import { Worker } from 'worker_threads';

let completed = 0;

const CPU_COUNT = os.cpus().length;
const WORKER_PATH = path.join(__dirname, 'worker.js');
for (let i = 0; i < CPU_COUNT; i++) {
    const worker = new Worker(WORKER_PATH);
    worker.on('message', () => (completed += 10000));
}

setInterval(() => {
    console.log('ops/s', completed.toLocaleString());
    completed = 0;
}, 1000);
