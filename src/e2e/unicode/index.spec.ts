import { ConfusableMatcher } from '../../wrapper';

describe('unicode', () => {
    it('should match swastikas', () => {
        const m = new ConfusableMatcher([['卐', '卐']], []);
        expect(m.indexOf('leafy卐\n卐\n卐\n卐\n卐\n卐\n卐\n卐\n卐\n卐\n卐\n卐\n卐', '卐').index).toBeGreaterThan(-1);
    });
});
