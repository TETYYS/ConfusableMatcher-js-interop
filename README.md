# TypeScript NAPI Interop for Confusable Matcher

This library exports a wrapper class bundled with TypeScript declarations that allows you to use the C++ ConfusableMatcher inside your JavaScript (NodeJS/CommonJS) applications.

## Installing

**To install this module, CMake v3.0 or higher must be present on the system.**

```bash
yarn add confusablematcher-js-interop
```

## Development

If you wish to develop this module, you can clone your own fork then execute the following commands to get setup:

```bash
# Download submodules
git submodule update --init --recursive --force --remote

# Install dependencies
yarn
```

If you want to build C++, run `yarn install`.

If you want to build TypeScript, run `yarn build`.

You can additionally run `yarn clean` to clean the build output for both languages.

### Testing

Once you have the development environment setup, you can run `yarn test` to run the test suite.

If you would like to generate coverage, you can run `yarn test:coverage`.

If you want to watch the test files and re-run them on code changes, you can run `yarn test:watch`

If writing tests, please replicate the tests in the [ConfusableMatcher source code](https://github.com/TETYYS/ConfusableMatcher).

### Benchmarks

You can run a benchmark by following the development steps, then running `yarn benchmark`.

You can enable performance debugging with benchmark flags the following benchmark flags:

| Flag            | Description                                                       |
| --------------- | ----------------------------------------------------------------- |
| -l --loop       | Prints the time elapsed in milliseconds between event loop ticks. |
| -m --microtasks | Prints the duration it took for a promise to resolve.             |

The command `yarn benchmark:debug` will run the benchmark with all flags enabled.

Please PR your reported time and hardware.

| Processor                 | Memory                                         | Version | #indexOf() Performance                   | #indexOfAsync() Performance             |
| ------------------------- | ---------------------------------------------- | ------- | ---------------------------------------- | --------------------------------------- |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 2.3.0   | 264,466 ops/sec ±0.32% (95 runs sampled) | 16,133 ops/sec ±0.90% (81 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 2.2.0   | 265,129 ops/sec ±1.02% (95 runs sampled) |                                         |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 2.1.0   | 254,060 ops/sec ±0.75% (92 runs sampled) |                                         |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 2.0.1   | 316,975 ops/sec ±0.30% (90 runs sampled) |                                         |
| AMD Ryzen 5 3600 6-Core   | DDR4-3200MHz CL16-18-18-38 1.35V 16GB (2x8GB)  | 2.0.1   | 307,821 ops/sec ±1.59% (89 runs sampled) |                                         |
| Intel i5-8300H 4-Core     | DDR4-2666MHz CL23-19-19-43 1.20V 08GB (1x8GB)  | 2.0.1   | 328,581 ops/sec ±1.56% (90 runs sampled) |                                         |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 2.0.0   | 137,296 ops/sec ±0.42% (90 runs sampled) |                                         |
| AMD Ryzen 5 3600 6-Core   | DDR4-3200MHz CL16-18-18-38 1.35V 16GB (2x8GB)  | 2.0.0   | 126,622 ops/sec ±1.07% (88 runs sampled) |                                         |
| Intel i5-8300H 4-Core     | DDR4-2666MHz CL23-19-19-43 1.20V 08GB (1x8GB)  | 2.0.0   | 125,028 ops/sec ±3.93% (87 runs sampled) |                                         |
