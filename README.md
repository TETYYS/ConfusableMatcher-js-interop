# TypeScript NAPI Interop for Confusable Matcher

This library exports a wrapper class bundled with TypeScript declarations that allows you to use the C++ ConfusableMatcher inside your JavaScript (NodeJS/CommonJS) applications.

-   [Installing](#installing)
-   [Usage](#usage)
    -   [new ConfusableMatcher()](#new-confusablematcher)
        -   [addMapping(key: string, value: string): void](#addmappingkey-string-value-string-void)
        -   [addMappings(mappings): void](#addmappingsmappings-void)
        -   [removeMapping(key, value): void](#removemappingkey-value-void)
        -   [removeMappings(mappings): void](#removemappingsmappings-void)
        -   [getMappings(): Mapping[]](#getmappings-mapping)
        -   [getKeyMappings(value): string[]](#getkeymappingsvalue-string)
        -   [addSkip(skip): void](#addskipskip-void)
        -   [addSkips(skips): void](#addskipsskips-void)
        -   [removeSkip(skip): void](#removeskipskip-void)
        -   [removeSkips(skips): void](#removeskipsskips-void)
        -   [getSkips(): string[]](#getskips-string)
        -   [indexOf(input, needle, options): IResult](#indexofinput-needle-options-iresult)
        -   [indexOfAsync(input, needle, options): Promise\<IResult\>](#indexofasyncinput-needle-options-promiseiresult)
        -   [lastIndexOf(input, needle, options): IResult](#lastindexofinput-needle-options-iresult)
        -   [lastIndexOfAsync(input, needle, options): Promise\<IResult\>](#lastindexofasyncinput-needle-options-promiseiresult)
        -   [contains(input, needle, options): boolean](#containsinput-needle-options-boolean)
        -   [containsAsync(input, needle, options?): Promise\<boolean\>](#containsasyncinput-needle-options-promiseboolean)
-   [Development](#development)
    -   [Testing](#testing)
    -   [Benchmarks](#benchmarks)

## Installing

**To install this module, CMake v3.0 or higher must be present on the system.**

```bash
yarn add confusablematcher-js-interop
```

## Usage

The example below shows explicit typings which are not necessary, and can be inferred, but highlights the types you may wish to use in your application.

```ts
import { ConfusableMatcher, EReturnStatus, IIndexOfOptions, IResult, Mapping } from 'confusablematcher-js-interop';

const map: Mapping[] = ['Z', 'Ž'];
const skips: string[] = [' ', '_', '-'];
const cm = new ConfusableMatcher(map, skips, true);
const options: Partial<IIndexOfOptions> = {
    matchRepeating: true,
    startIndex: 0,
    startFromEnd: false,
    statePushLimit: 10_000,
    matchOnWordBoundary: true,
};
const input: string =
    'Žebras are a short, stocky animal that is generally about 8 feet long and stands between 4 and 5 feet at the shoulder.';
const needle: string = 'Zebras';
const result: IResult = cm.indexOf(input, needle, options);
const status: EReturnStatus = result.status;
```

### new ConfusableMatcher()

```ts
/**
 * @param maps An array of [Key, Value] tuples. A key is the character to look for, a value is the resulting map.
 * @param skips An iterable of characters to skip.
 * @param addDefaultValues Whether to add ASCII characters and spaces to the map.
 */
new ConfusableMatcher(maps: Mapping[] = [], skips: Iterable<string> = [], addDefaultValues = true)
```

#### addMapping(key, value): void

```ts
/**
 * @description Adds a single map.
 * @param key The value to look for.
 * @param value The replacement value.
 */
addMapping(key: string, value: string): void
```

#### addMappings(mappings): void

```ts
/**
 * @description Adds multiples maps.
 * @param mappings An array of [Key, Value] tuples. A key is the character to look for, a value is the resulting map.
 */
addMappings(mappings: Iterable<Mapping>): void
```

#### removeMapping(key, value): void

```ts
/**
 * @description Removes a single map.
 * @param key The value to look for.
 * @param value The replacement value.
 */
removeMapping(key: string, value: string): void
```

#### removeMappings(mappings): void

```ts
/**
 * @description Removes multiples maps.
 * @param mappings An array of [Key, Value] tuples. A key is the character to look for, a value is the resulting map.
 */
removeMappings(mappings: Mapping[]): void
```

#### getMappings(): Mapping[]

```ts
/**
 * @returns An array of maps.
 */
getMappings(): Mapping[]
```

#### getKeyMappings(value): string[]

This method returns all of the mappings for a target value.
For example: using the map `['Z', 'Ž']` and calling `getKeyMappings('Ž')` would return `['Z'].`

```ts
/**
 * @returns Map key's for a value.
 */
getKeyMappings(value: string): string[]
```

#### addSkip(skip): void

```ts
/**
 * @description Adds a single skip.
 * @param skip The value to skip.
 */
addSkip(skip: string): void
```

#### addSkips(skips): void

```ts
/**
 * @description Adds multiple skips.
 * @param skips An array of values to skip.
 */
addSkips(skips: string[]): void
```

#### removeSkip(skip): void

```ts
/**
 * @description Removes a single skip.
 * @param skip The skip value to remove.
 */
removeSkip(skip: string): void
```

#### removeSkips(skips): void

```ts
/**
 * @description Removes multiple skips.
 * @param skips An array of skip values to remove.
 */
removeSkips(skips: string[]): void
```

#### getSkips(): string[]

```ts
/**
 * @returns An array of skips.
 */
getSkips(): string[]
```

#### indexOf(input, needle, options): IResult

```ts
/**
 * @description Searches for the first occurrence of `needle` in `input`.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns An object containing match information.
 */
indexOf(input: string, needle: string, options?: Partial<IIndexOfOptions>): IResult
```

#### indexOfAsync(input, needle, options): Promise<IResult>

```ts
/**
 * @description Searches for the first occurrence of `needle` in `input`.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns A Promise that resolves to an object containing match information.
 */
indexOfAsync(input: string, needle: string, options?: Partial<IIndexOfOptions>): Promise<IResult>
```

#### lastIndexOf(input, needle, options): IResult

```ts
/**
 * @description Searches for the last occurrence of `needle` in `input`.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns An object containing match information.
 */
lastIndexOf(input: string, needle: string, options?: Omit<Partial<IIndexOfOptions>, 'startFromEnd'>): IResult
```

#### lastIndexOfAsync(input, needle, options): Promise<IResult>

```ts
/**
 * @description Searches for the last occurrence of `needle` in `input`.
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns A Promise that resolves to an object containing match information.
 */
lastIndexOfAsync(input: string, needle: string, options?: Omit<Partial<IIndexOfOptions>, 'startFromEnd'>): Promise<IResult>
```

#### contains(input, needle, options): boolean

```ts
/**
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns True if the `needle` is found inside `input`.
 */
contains(input: string, needle: string, options?: IIndexOfOptions): boolean
```

#### containsAsync(input, needle, options?): Promise<boolean>

```ts
/**
 * @param input The string to search.
 * @param needle The string to look for in `input`.
 * @param options An optional object containing options in the search.
 * @returns A Promise that resolves to true if the `needle` is found inside `input`.
 */
containsAsync(input: string, needle: string, options?: IIndexOfOptions): Promise<boolean>
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
