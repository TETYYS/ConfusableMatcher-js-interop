# TypeScript NAPI Interop for Confusable Matcher

This library exports a wrapper class bundled with TypeScript declarations that allows you to use the C++ ConfusableMatcher inside your JavaScript (NodeJS/CommonJS) applications.

<!-- TOC depthFrom:2 -->

-   [1. Installation](#1-installation)
-   [2. Usage](#2-usage)
    -   [2.1. new ConfusableMatcher()](#21-new-confusablematcher)
        -   [2.1.1. addMapping(key, value): void](#211-addmappingkey-value-void)
        -   [2.1.2. addMappings(mappings): void](#212-addmappingsmappings-void)
        -   [2.1.3. removeMapping(key, value): void](#213-removemappingkey-value-void)
        -   [2.1.4. removeMappings(mappings): void](#214-removemappingsmappings-void)
        -   [2.1.5. getMappings(): Mapping[]](#215-getmappings-mapping)
        -   [2.1.6. getKeyMappings(value): string[]](#216-getkeymappingsvalue-string)
        -   [2.1.7. addSkip(skip): void](#217-addskipskip-void)
        -   [2.1.8. addSkips(skips): void](#218-addskipsskips-void)
        -   [2.1.9. removeSkip(skip): void](#219-removeskipskip-void)
        -   [2.1.10. removeSkips(skips): void](#2110-removeskipsskips-void)
        -   [2.1.11. getSkips(): string[]](#2111-getskips-string)
        -   [2.1.12. computeStringPosPointers(needle): number](#2112-computestringpospointersneedle-number)
        -   [2.1.13. freeStringPosPointers(pointer): void](#2113-freestringpospointerspointer-void)
        -   [2.1.14. indexOfSync(input, needle, options): IResult](#2114-indexofsyncinput-needle-options-iresult)
        -   [2.1.15. indexOf(input, needle, options): Promise<IResult>](#2115-indexofinput-needle-options-promiseiresult)
        -   [2.1.16. lastIndexOfSync(input, needle, options): IResult](#2116-lastindexofsyncinput-needle-options-iresult)
        -   [2.1.17. lastIndexOf(input, needle, options): Promise<IResult>](#2117-lastindexofinput-needle-options-promiseiresult)
        -   [2.1.18. containsSync(input, needle, options): boolean](#2118-containssyncinput-needle-options-boolean)
        -   [2.1.19. contains(input, needle, options?): Promise<boolean>](#2119-containsinput-needle-options-promiseboolean)
        -   [2.1.20. indexOfDebugFailuresSync(input, needle, options?): string[]](#2120-indexofdebugfailuressyncinput-needle-options-string)
        -   [2.1.21. indexOfDebugFailures(input, needle, options?): Promise<string[]>](#2121-indexofdebugfailuresinput-needle-options-promisestring)
        -   [2.1.22. indexOfDebugFailuresExSync(input, needle, options?): IDebugFailureResult](#2122-indexofdebugfailuresexsyncinput-needle-options-idebugfailureresult)
        -   [2.1.23. indexOfDebugFailuresEx(input, needle, options?): Promise<IDebugFailureResult>](#2123-indexofdebugfailuresexinput-needle-options-promiseidebugfailureresult)
-   [3. Development](#3-development)
    -   [3.1. Testing](#31-testing)
    -   [3.2. Benchmarks](#32-benchmarks)

<!-- /TOC -->

## 1. Installation

**To install this module, CMake v3.0 or higher must be present on the system.**

```bash
yarn add confusablematcher-js-interop
```

## 2. Usage

The example below shows explicit typings which are not necessary, and can be inferred, but highlights the types you may wish to use in your application.

```ts
import type { IIndexOfOptions, IResult, Mapping, StrPosPointer } from 'confusablematcher-js-interop';
import { ConfusableMatcher, EReturnStatus } from 'confusablematcher-js-interop';

const map: Mapping[] = [['Z', 'Ž']];
const skips: string[] = [' ', '_', '-'];
const cm = new ConfusableMatcher(map, skips, true);

const input =
    'Žebras are a short, stocky animal that is generally about 8 feet long and stands between 4 and 5 feet at the shoulder.';
const needle = 'Zebras';

let strPosPtrs: StrPosPointer | undefined = cm.computeStringPosPointers(needle);

const options: Partial<IIndexOfOptions> = {
    matchOnWordBoundary: true,
    matchRepeating: true,
    needlePosPointers: strPosPtrs,
    startFromEnd: false,
    startIndex: 0,
    timeoutNs: 1e6, // 1 ms
};
const result: IResult = cm.indexOfSync(input, needle, options);

cm.freeStringPosPointers(strPosPtrs);
strPosPtrs = undefined;
delete options.needlePosPointers;

const status: EReturnStatus = result.status;
console.table({ ...result, status: EReturnStatus[status] });
```

**It is important to realise the distinction between the synchronous and asynchronous methods.**

**Async methods are considerably slower than the sync versions, however they are [non-blocking](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/#don-t-block-the-event-loop) by utilizing the [NodeJS thread pool](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/#what-code-runs-on-the-worker-pool).**

**[The thread pool size can be changed by setting the `UV_THREADPOOL_SIZE` environment variable](https://nodejs.org/api/cli.html#cli_uv_threadpool_size_size). One thread per physical CPU core is recommended, and the default is four.**

**Keep in mind more threads is more context switches, setting a higher thread count that core count will not give you insane performance - you will have to tune your application for it's runtime environment.**

### 2.1. new ConfusableMatcher()

```ts
/**
 * @param maps An array of [Key, Value] tuples. A key is the character to look for, a value is the resulting map.
 * @param skips An iterable of characters to skip.
 * @param addDefaultValues Whether to add ASCII characters and spaces to the map.
 */
new ConfusableMatcher(maps: Mapping[] = [], skips: Iterable<string> = [], addDefaultValues = true)
```

#### 2.1.1. addMapping(key, value): void

```ts
/**
 * @description Adds a single map.
 * @param key The value to look for.
 * @param value The replacement value.
 */
addMapping(key: string, value: string): void
```

#### 2.1.2. addMappings(mappings): void

```ts
/**
 * @description Adds multiples maps.
 * @param mappings An array of [Key, Value] tuples. A key is the character to look for, a value is the resulting map.
 */
addMappings(mappings: Iterable<Mapping>): void
```

#### 2.1.3. removeMapping(key, value): void

```ts
/**
 * @description Removes a single map.
 * @param key The value to look for.
 * @param value The replacement value.
 */
removeMapping(key: string, value: string): void
```

#### 2.1.4. removeMappings(mappings): void

```ts
/**
 * @description Removes multiples maps.
 * @param mappings An array of [Key, Value] tuples. A key is the character to look for, a value is the resulting map.
 */
removeMappings(mappings: Mapping[]): void
```

#### 2.1.5. getMappings(): Mapping[]

```ts
/**
 * @returns An array of maps.
 */
getMappings(): Mapping[]
```

#### 2.1.6. getKeyMappings(value): string[]

This method returns all of the mappings for a target value.
For example: using the map `['Z', 'Ž']` and calling `getKeyMappings('Ž')` would return `['Z'].`

```ts
/**
 * @returns Map key's for a value.
 */
getKeyMappings(value: string): string[]
```

#### 2.1.7. addSkip(skip): void

```ts
/**
 * @description Adds a single skip.
 * @param skip The value to skip.
 */
addSkip(skip: string): void
```

#### 2.1.8. addSkips(skips): void

```ts
/**
 * @description Adds multiple skips.
 * @param skips An array of values to skip.
 */
addSkips(skips: string[]): void
```

#### 2.1.9. removeSkip(skip): void

```ts
/**
 * @description Removes a single skip.
 * @param skip The skip value to remove.
 */
removeSkip(skip: string): void
```

#### 2.1.10. removeSkips(skips): void

```ts
/**
 * @description Removes multiple skips.
 * @param skips An array of skip values to remove.
 */
removeSkips(skips: string[]): void
```

#### 2.1.11. getSkips(): string[]

```ts
/**
 * @returns An array of skips.
 */
getSkips(): string[]
```

#### 2.1.12. computeStringPosPointers(needle): number

```ts
/**
 * @description Pre-computes a needle as a tree structure internally for faster matching.
 * If this is used, manual memory cleanup through `freeStringPosPointers` is required.
 * @param needle The needle to build a tree for.
 * @returns A pointer value as int64 (number).
 */
computeStringPosPointers(needle: string): number
```

#### 2.1.13. freeStringPosPointers(pointer): void

```ts
/**
 * @description Frees the memory used by a precomputed needle.
 * @param pointer An int64 pointer value returned from `computeStringPosPointers`.
 */
freeStringPosPointers(pointer: number): void
```

#### 2.1.14. indexOfSync(input, needle, options): IResult

```ts
/**
 * @description Searches for the first occurrence of `needle` in `input`.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns An object containing match information.
 */
indexOfSync(input: string, needle: string, options?: Partial<IIndexOfOptions>): IResult
```

#### 2.1.15. indexOf(input, needle, options): Promise<IResult>

```ts
/**
 * @description Searches for the first occurrence of `needle` in `input`.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns A Promise that resolves to an object containing match information.
 */
indexOf(input: string, needle: string, options?: Partial<IIndexOfOptions>): Promise<IResult>
```

#### 2.1.16. lastIndexOfSync(input, needle, options): IResult

```ts
/**
 * @description Searches for the last occurrence of `needle` in `input`.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns An object containing match information.
 */
lastIndexOfSync(input: string, needle: string, options?: Omit<Partial<IIndexOfOptions>, 'startFromEnd'>): IResult
```

#### 2.1.17. lastIndexOf(input, needle, options): Promise<IResult>

```ts
/**
 * @description Searches for the last occurrence of `needle` in `input`.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns A Promise that resolves to an object containing match information.
 */
lastIndexOf(input: string, needle: string, options?: Omit<Partial<IIndexOfOptions>, 'startFromEnd'>): Promise<IResult>
```

#### 2.1.18. containsSync(input, needle, options): boolean

```ts
/**
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns True if the `needle` is found inside `input`.
 */
containsSync(input: string, needle: string, options?: IIndexOfOptions): boolean
```

#### 2.1.19. contains(input, needle, options?): Promise<boolean>

```ts
/**
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns A Promise that resolves to true if the `needle` is found inside `input`.
 */
contains(input: string, needle: string, options?: IIndexOfOptions): Promise<boolean>
```

#### 2.1.20. indexOfDebugFailuresSync(input, needle, options?): string[]

```ts
/**
 * @description Searches for the first occurrence of `needle` in `input` with debugging enabled.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns An array of strings containing failure debugging reasons.
 */
indexOfDebugFailuresSync(input: string, needle: string, options?: Partial<IIndexOfOptions>): string[]
```

#### 2.1.21. indexOfDebugFailures(input, needle, options?): Promise<string[]>

```ts
/**
 * @description Searches for the first occurrence of `needle` in `input` with debugging enabled.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns An array of strings containing failure debugging reasons.
 */
indexOfDebugFailures(input: string, needle: string, options?: Partial<IIndexOfOptions>): Promise<string[]>
```

#### 2.1.22. indexOfDebugFailuresExSync(input, needle, options?): IDebugFailureResult

```ts
/**
 * @description Searches for the first occurrence of `needle` in `input` with debugging enabled.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns An object containing match information.
 */
indexOfDebugFailuresExSync(input: string, needle: string, options?: Partial<IIndexOfOptions>): IDebugFailureResult
```

#### 2.1.23. indexOfDebugFailuresEx(input, needle, options?): Promise<IDebugFailureResult>

```ts
/**
 * @description Searches for the first occurrence of `needle` in `input` with debugging enabled.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns A Promise that resolves to an object containing match information.
 */
indexOfDebugFailuresEx(input: string, needle: string, options?: Partial<IIndexOfOptions>): Promise<IDebugFailureResult>
```

## 3. Development

If you wish to develop this module, you can clone your own fork then execute the following commands to get setup:

```bash
# Download submodules
git submodule update --init --recursive --force --remote

# Install dependencies
yarn
```

If you want to build C++, run `yarn build:cpp`.

If you want to build TypeScript, run `yarn build:ts`.

You can additionally run `yarn clean` to clean the build output for both languages.

### 3.1. Testing

Once you have the development environment setup, you can run `yarn test` to run the test suite.

If you would like to generate coverage, you can run `yarn test:coverage`.

If you want to watch the test files and re-run them on code changes, you can run `yarn test:watch`

If writing tests, please replicate the tests in the [ConfusableMatcher source code](https://github.com/TETYYS/ConfusableMatcher).

### 3.2. Benchmarks

You can run a benchmark by following the development steps, then running `yarn benchmark`.

You can enable performance debugging with benchmark flags the following benchmark flags:

| Flag            | Description                                                       |
| --------------- | ----------------------------------------------------------------- |
| -l --loop       | Prints the time elapsed in milliseconds between event loop ticks. |
| -m --microtasks | Prints the duration it took for a promise to resolve.             |

The command `yarn benchmark:debug` will run the benchmark with all flags enabled.

Please PR your reported time and hardware.

| Processor                 | Memory                                         | Version | #indexOf() Performance                  | #indexOfSync() Performance               |
| ------------------------- | ---------------------------------------------- | ------- | --------------------------------------- | ---------------------------------------- |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 4.7.1   | 15,639 ops/sec ±0.65% (83 runs sampled) | 246,712 ops/sec ±0.35% (96 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 4.7.0   | 15,134 ops/sec ±0.84% (83 runs sampled) | 244,674 ops/sec ±0.41% (96 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 4.6.0   | 16,084 ops/sec ±1.83% (78 runs sampled) | 237,149 ops/sec ±0.42% (93 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 4.5.0   | 14,664 ops/sec ±0.78% (87 runs sampled) | 239,525 ops/sec ±0.47% (96 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 4.4.0   | 14,686 ops/sec ±0.77% (85 runs sampled) | 240,802 ops/sec ±0.62% (95 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 4.3.0   | 14,794 ops/sec ±0.70% (85 runs sampled) | 240,648 ops/sec ±0.36% (94 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 4.0.0   | 15,312 ops/sec ±1.11% (81 runs sampled) | 248,335 ops/sec ±0.48% (93 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 3.2.0   | 15,944 ops/sec ±1.17% (79 runs sampled) | 251,881 ops/sec ±1.77% (93 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 3.1.0   | 14,659 ops/sec ±1.33% (81 runs sampled) | 249,710 ops/sec ±0.38% (97 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 3.0.0   | 16,133 ops/sec ±0.90% (81 runs sampled) | 264,466 ops/sec ±0.32% (95 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 2.2.0   |                                         | 265,129 ops/sec ±1.02% (95 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 2.1.0   |                                         | 254,060 ops/sec ±0.75% (92 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 2.0.1   |                                         | 316,975 ops/sec ±0.30% (90 runs sampled) |
| AMD Ryzen 5 3600 6-Core   | DDR4-3200MHz CL16-18-18-38 1.35V 16GB (2x8GB)  | 2.0.1   |                                         | 307,821 ops/sec ±1.59% (89 runs sampled) |
| Intel i5-8300H 4-Core     | DDR4-2666MHz CL23-19-19-43 1.20V 08GB (1x8GB)  | 2.0.1   |                                         | 328,581 ops/sec ±1.56% (90 runs sampled) |
| AMD Ryzen 9 3900X 12-Core | DDR4-3200MHz CL16-18-18-38 1.35V 64GB (4x16GB) | 2.0.0   |                                         | 137,296 ops/sec ±0.42% (90 runs sampled) |
| AMD Ryzen 5 3600 6-Core   | DDR4-3200MHz CL16-18-18-38 1.35V 16GB (2x8GB)  | 2.0.0   |                                         | 126,622 ops/sec ±1.07% (88 runs sampled) |
| Intel i5-8300H 4-Core     | DDR4-2666MHz CL23-19-19-43 1.20V 08GB (1x8GB)  | 2.0.0   |                                         | 125,028 ops/sec ±3.93% (87 runs sampled) |
