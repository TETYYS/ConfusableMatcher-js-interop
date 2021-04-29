# TypeScript NAPI Interop for Confusable Matcher

This library exports a wrapper class bundled with TypeScript declarations that allows you to use the C++ ConfusableMatcher inside your JavaScript (NodeJS/CommonJS) applications.

## Installing

**To install this module, CMake v3.9 or higher must be present on the system.**

```bash
yarn add confusablematcher-js-interop
```

## Benchmarks

| Processor                 | Memory                                         | Performance                              |
| ------------------------- | ---------------------------------------------- | ---------------------------------------- |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 137,296 ops/sec ±0.42% (90 runs sampled) |
| AMD Ryzen 5 3600 6-Core   | DDR4-3200MHz CL16-18-18-38 1.35V 16GB (2x8GB)  | 126,622 ops/sec ±1.07% (88 runs sampled) |
| Intel i5-8300H 4-Core     | DDR4-2666MHz CL23-19-19-43 1.20V 08GB (1x8GB)  | 125,028 ops/sec ±3.93% (87 runs sampled) |
