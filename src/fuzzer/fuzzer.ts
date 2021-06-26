import { ConfusableMatcher } from '../wrapper';
/**
 * Maps should be an array of objects with key/value fields.
 */
import Maps from './resources/maps.json';

console.log(`Loaded ${Maps.length} Maps`);

process.once('SIGSEGV', (signal) => {
    console.error(signal);
});

console.log('Starting');

const SKIP_INDEXEX = new Set<number>([
    /* Write indexes to skip */
]);

for (let i = 0; i < Maps.length; i++) {
    const { key, value } = Maps[i];
    if (SKIP_INDEXEX.has(i)) {
        console.log(`Skipping ${i}: '${key}' -> '${value}'`);
        continue;
    }

    console.log(`Trying ${i}: '${key}' -> '${value}'`);
    new ConfusableMatcher([[key, value]]);
}
console.log('Success!');
