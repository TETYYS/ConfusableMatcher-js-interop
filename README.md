# TypeScript NAPI Interop for Confusable Matcher

This library exports a wrapper class bundled with TypeScript declarations that allows you to use the C++ ConfusableMatcher inside your JavaScript (NodeJS/CommonJS) applications.

## Benchmark

```md
yarn benchmark

ConfusableMatcher#indexOf x 137,296 ops/sec ±0.42% (90 runs sampled)
```
