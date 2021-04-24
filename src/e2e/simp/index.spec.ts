import { ConfusableMatcher } from '../../wrapper';
import { CASES } from './cases';
import { IGNORES } from './ignores';
import { MAPS } from './maps';

describe('simp', () => {
    const m = new ConfusableMatcher(MAPS, IGNORES);

    // Shortcut tests for now
    for (const testCase of CASES.slice(0, 1)) {
        test(testCase, () => {
            expect(m.indexOf(testCase, 'SIMP').index).toBeGreaterThan(-1);
        });
    }
});
