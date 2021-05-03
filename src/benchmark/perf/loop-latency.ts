import { now } from 'microtime';

function measureEventLoopLatency() {
    const start = now();
    setTimeout(() => console.log(`Event loop latency: ${(now() - start) / 1000} ms`)).unref();
}

export function start(interval: number) {
    measureEventLoopLatency();
    setInterval(measureEventLoopLatency, interval).unref();
}
