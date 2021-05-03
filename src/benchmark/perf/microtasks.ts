import async_hooks from 'async_hooks';
import { performance, PerformanceObserver } from 'perf_hooks';

const promiseAsyncResources = new Set();
const hook = async_hooks.createHook({
    destroy(id) {
        if (promiseAsyncResources.has(id)) {
            promiseAsyncResources.delete(id);
            performance.mark(`PROMISE-${id}-Destroy`);
            performance.measure(`PROMISE-${id}`, `PROMISE-${id}-Init`, `PROMISE-${id}-Destroy`);
        }
    },
    init(id, type) {
        if (type === 'PROMISE') {
            performance.mark(`PROMISE-${id}-Init`);
            promiseAsyncResources.add(id);
        }
    },
});
const perf = new PerformanceObserver((list) => {
    const [entry] = list.getEntries();
    if (entry) {
        console.log(`${entry.name}: ${entry.duration}ms`);
        performance.clearMarks();
    }
});

export function start() {
    hook.enable();
    perf.observe({ buffered: true, entryTypes: ['measure'] });
}
