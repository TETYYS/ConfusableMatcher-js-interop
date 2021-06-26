import { ConfusableMatcher } from '../wrapper';
/**
 * Maps should be an array of objects with key/value fields.
 */
import Maps from './resources/maps.json';
/**
 * Maps should be an array of objects with a value field.
 */
import Skips from './resources/skips.json';

console.log(`Loaded ${Maps.length} Maps`);
console.log(`Loaded ${Skips.length} Skips`);

process.once('SIGSEGV', (signal) => {
    console.error(signal);
});

/**
 * Maps
 */
const MAP_INDEX_SKIPS = new Set<number>([
    /* Write indexes to skip */
]);
console.log('Testing Maps');
for (let i = 0; i < Maps.length; i++) {
    const { key, value } = Maps[i];
    if (MAP_INDEX_SKIPS.has(i)) {
        console.log(`Skipping ${i}: '${key}' -> '${value}'`);
        continue;
    }

    console.log(`Trying Map ${i}: '${key}' -> '${value}'`);
    new ConfusableMatcher([[key, value]]);
}
console.log('Maps Success!');

/**
 * Maps
 */
const SKIP_INDEX_SKIPS = new Set<number>([
    /* Write indexes to skip */
]);
console.log('Testing Skips');
for (let i = 0; i < Skips.length; i++) {
    const { value } = Skips[i];
    if (MAP_INDEX_SKIPS.has(i)) {
        console.log(`Skipping ${i}: '${value}'`);
        continue;
    }

    console.log(`Trying Skip ${i}: '${value}'`);
    new ConfusableMatcher([], [value]);
}
console.log('Skips Success!');
