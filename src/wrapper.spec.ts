/* cSpell: disable */
import type { IIndexOfOptions, Mapping } from './binding';
import { EReturnStatus } from './binding';
import { ConfusableMatcher } from './wrapper';

describe('Unit Tests', () => {
    test('Test1', () => {
        const m = new ConfusableMatcher([
            ['N', 'T'],
            ['I', 'E'],
            ['C', 'S'],
            ['E', 'T'],
        ]);
        const r = m.indexOfSync('TEST', 'NICE', { matchRepeating: false, startIndex: 0 });

        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(4);
    });

    test('Test2', () => {
        const m = new ConfusableMatcher([
            ['V', 'VA'],
            ['V', 'VO'],
        ]);

        let r = m.indexOfSync('VV', 'VAVOVAVO', { matchRepeating: false, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.NO_MATCH);
        r = m.indexOfSync('VAVOVAVO', 'VV', { matchRepeating: false, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start == 0 || r.start == 4).toBeTruthy();
        expect(r.size == 3 || r.size == 4).toBeTruthy();

        r = m.indexOfSync('VAVOVAVO', 'VV', { matchRepeating: false, startIndex: 4 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(4);
        expect(r.size == 3 || r.size == 4).toBeTruthy();

        r = m.indexOfSync('VAVOVAVO', 'VV', { matchRepeating: false, startIndex: 2 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start == 2 || r.start == 4).toBeTruthy();
        expect(r.size == 3 || r.size == 4).toBeTruthy();

        r = m.indexOfSync('VAVOVAVO', 'VV', { matchRepeating: false, startIndex: 3 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(4);
        expect(r.size == 3 || r.size == 4).toBeTruthy();
    });

    test('Test3', () => {
        const m = new ConfusableMatcher(
            [
                ['A', '\x02\x03'],
                ['B', '\xFA\xFF'],
            ],
            [],
            true
        );
        const r = m.indexOfSync('\x02\x03\xFA\xFF', 'AB');
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(4);
    });

    test('Test4', () => {
        const m = new ConfusableMatcher(
            [
                ['S', '$'],
                ['D', '[)'],
            ],
            ['_', ' ']
        );
        const r = m.indexOfSync('A__ _ $$$[)D', 'ASD', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(11);
    });

    test('Test5', () => {
        const m = new ConfusableMatcher([
            ['N', '/\\/'],
            ['N', '/\\'],
            ['I', '/'],
        ]);
        const r = m.indexOfSync('/\\/CE', 'NICE', { matchRepeating: false, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);
    });

    test('Test6', () => {
        const m = new ConfusableMatcher([
            ['N', '/\\/'],
            ['V', '\\/'],
            ['I', '/'],
        ]);

        let r = m.indexOfSync('I/\\/AM', 'INAN', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.NO_MATCH);
        r = m.indexOfSync('I/\\/AM', 'INAM', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(6);

        r = m.indexOfSync('I/\\/AM', 'IIVAM', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(6);
    });

    test('Test7', () => {
        const s =
            'AAAAAAAAASSAFSAFNFNFNISFNSIFSIFJSDFUDSHF ASUF/|/__/|/___%/|/%I%%/|//|/%%%%%NNNN/|/NN__/|/N__𝘪G___%____$__G__𝓰𝘦Ѓ';
        const m = new ConfusableMatcher(getDefaultMap(), ['_', '%', '$']);
        const r = m.indexOfSync(s, 'NIGGER', { matchRepeating: true, startIndex: 0 });

        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect((r.start == 64 && r.size == 50) || (r.start == 89 && r.size == 25)).toBeTruthy();
    });

    test('Test8', () => {
        const m = new ConfusableMatcher([], ['[', ']', '̲', '̅']);
        const r = m.indexOfSync(
            '[̲̅a̲̅][̲̅b̲̅][̲̅c̲̅][̲̅d̲̅][̲̅e̲̅][̲̅f̲̅][̲̅g̲̅][̲̅h̲̅][̲̅i̲̅][̲̅j̲̅][̲̅k̲̅][̲̅l̲̅][̲̅m̲̅][̲̅n̲̅][̲̅o̲̅][̲̅p̲̅][̲̅q̲̅][̲̅r̲̅][̲̅s̲̅][̲̅t̲̅][̲̅u̲̅][̲̅v̲̅][̲̅w̲̅][̲̅x̲̅][̲̅y̲̅][̲̅z̲̅][̲̅0̲̅][̲̅1̲̅][̲̅2̲̅][̲̅3̲̅][̲̅4̲̅][̲̅5̲̅][̲̅6̲̅][̲̅7̲̅][̲̅8̲̅][̲̅9̲̅][̲̅0̲̅]',
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890',
            { matchRepeating: false }
        );
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(3);
        expect(r.size).toEqual(253);
    });

    test('Test9', () => {
        const m = new ConfusableMatcher([
            ['B', 'A'],
            ['B', 'AB'],
            ['B', 'ABC'],
            ['B', 'ABCD'],
            ['B', 'ABCDE'],
            ['B', 'ABCDEF'],
            ['B', 'ABCDEFG'],
            ['B', 'ABCDEFGH'],
            ['B', 'ABCDEFGHI'],
            ['B', 'ABCDEFGHIJ'],
            ['B', 'ABCDEFGHIJK'],
            ['B', 'ABCDEFGHIJKL'],
            ['B', 'ABCDEFGHIJKLM'],
            ['B', 'ABCDEFGHIJKLMN'],
            ['B', 'ABCDEFGHIJKLMNO'],
            ['B', 'ABCDEFGHIJKLMNOP'],
            ['B', 'ABCDEFGHIJKLMNOPQ'],
            ['B', 'ABCDEFGHIJKLMNOPQR'],
            ['B', 'ABCDEFGHIJKLMNOPQRS'],
        ]);
        const r = m.indexOfSync('ABCDEFGHIJKLMNOPQRS', 'B', {
            matchRepeating: false,
            startFromEnd: false,
            startIndex: 0,
            statePushLimit: 1000,
        });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start == 0 || r.start == 1).toBeTruthy();
        expect(r.size).toEqual(1);
    });

    test('Test9.1', () => {
        const m = new ConfusableMatcher([
            ['B', 'A'],
            ['B', 'AB'],
            ['B', 'ABC'],
            ['B', 'ABCD'],
            ['B', 'ABCDE'],
            ['B', 'ABCDEF'],
            ['B', 'ABCDEFG'],
            ['B', 'ABCDEFGH'],
            ['B', 'ABCDEFGHI'],
            ['B', 'ABCDEFGHIJ'],
            ['B', 'ABCDEFGHIJK'],
            ['B', 'ABCDEFGHIJKL'],
            ['B', 'ABCDEFGHIJKLM'],
            ['B', 'ABCDEFGHIJKLMN'],
            ['B', 'ABCDEFGHIJKLMNO'],
            ['B', 'ABCDEFGHIJKLMNOPQ'],
            ['B', 'ABCDEFGHIJKLMNOPQR'],
            ['B', 'ABCDEFGHIJKLMNOPQRS'],
            ['B', 'PQRSTUVWXYZ0123456789'],
            ['B', 'PQRSTUVWXYZ012345678'],
            ['B', 'PQRSTUVWXYZ01234567'],
            ['B', 'PQRSTUVWXYZ0123456'],
            ['B', 'PQRSTUVWXYZ012345'],
            ['B', 'PQRSTUVWXYZ01234'],
            ['B', 'PQRSTUVWXYZ0123'],
            ['B', 'PQRSTUVWXYZ012'],
            ['B', 'PQRSTUVWXYZ01'],
            ['B', 'PQRSTUVWXYZ0'],
            ['B', 'PQRSTUVWXYZ'],
            ['B', 'PQRSTUVWXY'],
            ['B', 'PQRSTUVWX'],
            ['B', 'PQRSTUVW'],
            ['B', 'PQRSTUV'],
            ['B', 'PQRSTU'],
            ['B', 'PQRST'],
            ['B', 'PQRS'],
            ['B', 'PQR'],
            ['B', 'PQ'],
            ['B', 'P'],
        ]);
        let r = m.indexOfSync('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 'BB', {
            matchRepeating: false,
            startFromEnd: false,
            startIndex: 0,
            statePushLimit: 1000,
        });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(2);

        r = m.indexOfSync(
            'PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789',
            'BBBBBBBBBBBBBBBBBBBBBBBBBBB',
            {
                matchRepeating: true,
                startFromEnd: false,
                startIndex: 0,
                statePushLimit: 2000,
            }
        );
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size >= 547 && r.size <= 567).toBeTruthy();
    });

    test('Test10', () => {
        const m = new ConfusableMatcher();
        let r = m.indexOfSync(':)', '', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(0);
        r = m.indexOfSync('', ':)', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.NO_MATCH);
    });

    test('Test11', () => {
        const m = new ConfusableMatcher([['A', 'A']]);
        const r = m.indexOfSync('ABAAA', 'ABAR', {
            matchRepeating: true,
            startFromEnd: false,
            startIndex: 0,
            statePushLimit: 1000,
        });
        expect(r.status).toEqual(EReturnStatus.NO_MATCH);
    });

    test('Test12', () => {
        const m = new ConfusableMatcher([]);
        const r = m.indexOfSync('A', 'A', { matchRepeating: false, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(1);
    });

    test('Test12.1', () => {
        const m = new ConfusableMatcher([], [], false);
        const r = m.indexOfSync('A', 'A', { matchRepeating: false, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.NO_MATCH);
    });

    test('Test13', () => {
        expect(() => new ConfusableMatcher([['', '?']])).toThrow();
        expect(() => new ConfusableMatcher([['', '?']])).toThrow();
        expect(() => new ConfusableMatcher([['?', '']])).toThrow();
        expect(() => new ConfusableMatcher([['', '']])).toThrow();
        expect(() => new ConfusableMatcher([['\x00', '?']])).toThrow();
        expect(() => new ConfusableMatcher([['?', '\x00']])).toThrow();
        expect(() => new ConfusableMatcher([['\x01', '?']])).toThrow();
        expect(() => new ConfusableMatcher([['?', '\x01']])).toThrow();
        expect(() => new ConfusableMatcher([['\x00', '\x01']])).toThrow();
        expect(() => new ConfusableMatcher([['\x00', '\x00']])).toThrow();
        expect(() => new ConfusableMatcher([['\x01', '\x00']])).toThrow();
        expect(() => new ConfusableMatcher([['\x01', '\x01']])).toThrow();
        expect(() => new ConfusableMatcher([['\x01\x00', '\x00\x01']])).toThrow();
        expect(() => new ConfusableMatcher([['A\x00', '\x00A']])).toThrow();
        expect(() => new ConfusableMatcher([['\x01\x00', '\x00\x01']])).toThrow();
        expect(() => new ConfusableMatcher([['A\x00', 'A\x01']])).not.toThrow();
        expect(() => new ConfusableMatcher([['A\x01', 'A\x00']])).not.toThrow();
        expect(() => new ConfusableMatcher([['A\x00', 'A\x00']])).not.toThrow();
        expect(() => new ConfusableMatcher([['A\x01', 'A\x01']])).not.toThrow();
    });

    test('Test14', () => {
        const m = new ConfusableMatcher([]);
        for (let i = 0; i < 1e3; i++) {
            m.indexOfSync('ASD', 'ZXC', { matchRepeating: true, startIndex: 0 });
            m.indexOfSync('ASD', 'ZXC', { matchRepeating: true, startIndex: 0 });
            m.indexOfSync('ASD', 'ZXC', { matchRepeating: true, startIndex: 0 });
        }
    });

    test('Test15', () => {
        const m = new ConfusableMatcher([['.', '.']], ['.']);
        const r = m.indexOfSync('FOLLOWONBOT.COM', 'FOLLOWONBOT.COM', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(15);
    });

    test('Test16', () => {
        const m = new ConfusableMatcher([
            ['N', '/\\/'],
            ['N', '\\/\\'],
        ]);
        const r = m.indexOfSync(
            '/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/',
            'NNNNNNNNNNNNNNNA',
            { matchRepeating: true, startIndex: 0 }
        );
        expect(r.status).toEqual(EReturnStatus.STATE_PUSH_LIMIT_EXCEEDED);
    });

    test('Test17', () => {
        const m = new ConfusableMatcher([
            ['N', '_'],
            ['N', '__'],
        ]);
        const r = m.indexOfSync('NNNNN__N_NN___NNNNNN_NN_N__NNNN__N_NNNNNICE', 'NIRE', {
            matchRepeating: true,
            startFromEnd: false,
            startIndex: 0,
            statePushLimit: 100000,
        });
        expect(r.status).toEqual(EReturnStatus.NO_MATCH);
    });

    test('Test18', () => {
        const m = new ConfusableMatcher([
            ['N', '12345'],
            ['A', '1'],
            ['A', '5'],
            ['A', '234'],
        ]);
        const r = m.indexOfSync('N12345M', 'NAM', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(7);
    });

    test('Test19', () => {
        const m = new ConfusableMatcher([
            ['A', '1'],
            ['B', '1'],
            ['C', '1'],
        ]);
        const r = m.indexOfSync('111111', 'ABC', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(3);
    });

    test('Test20', () => {
        const m = new ConfusableMatcher(
            [
                ['A', '1'],
                ['B', '1'],
                ['C', '1'],
            ],
            [],
            false
        );
        expect('1').toEqual(m.getKeyMappings('A')[0]);
        expect('1').toEqual(m.getKeyMappings('B')[0]);
        expect('1').toEqual(m.getKeyMappings('C')[0]);
    });

    test('Test21', () => {
        const m = new ConfusableMatcher(
            [
                ['1', 'AB'],
                ['1', 'CD'],
                ['2', 'EEE'],
            ],
            [],
            false
        );
        const mappings = m.getKeyMappings('1');
        expect(mappings[0] === 'AB' || mappings[0] === 'CD').toBeTruthy();
        expect(mappings[1] === 'AB' || mappings[1] === 'CD').toBeTruthy();
        expect('EEE').toEqual(m.getKeyMappings('2')[0]);
    });

    test('Test22', () => {
        const COUNT = 500;
        const KEY = '123';
        const m = new ConfusableMatcher(
            Array.from<unknown, Mapping>({ length: COUNT }, (i, x) => [KEY, x.toString()]),
            [],
            false
        );
        expect(m.getKeyMappings(KEY)).toHaveLength(COUNT);
    });

    test('Test23', () => {
        const s = 'AA BB CC AA FF AA RR';
        const m = new ConfusableMatcher(getDefaultMap());

        let r = m.indexOfSync(s, 'AA', { matchRepeating: true });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(2);

        r = m.indexOfSync(s, 'AA', { matchRepeating: true, startFromEnd: true, startIndex: s.length - 1 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(15);
        expect(r.size).toEqual(2);
    });

    test('Test24', () => {
        const s = 'DASD';
        const m = new ConfusableMatcher(getDefaultMap());
        const r = m.indexOfSync(s, 'D', { matchRepeating: true, startFromEnd: true, startIndex: s.length - 1 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(3);
        expect(r.size).toEqual(1);
    });

    test('Test25', () => {
        const s = 'ASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASASB';
        const m = new ConfusableMatcher(getDefaultMap());

        let r = m.indexOfSync(s, 'ASB', {
            matchRepeating: true,
            startFromEnd: false,
            startIndex: 0,
            statePushLimit: 20,
        });
        expect(r.status).toEqual(EReturnStatus.STATE_PUSH_LIMIT_EXCEEDED);

        r = m.indexOfSync(s, 'ASB', {
            matchRepeating: true,
            startFromEnd: true,
            startIndex: s.length - 1,
            statePushLimit: 20,
        });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(92);
        expect(r.size).toEqual(3);
    });

    test('Test26', () => {
        const m = new ConfusableMatcher(getDefaultMap());
        const r = m.indexOfSync('AAA', 'A', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(3);
    });

    test('Test27', () => {
        const m = new ConfusableMatcher(getDefaultMap());
        const r = m.indexOfSync('BB AAA', 'A', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(3);
        expect(r.size).toEqual(3);
    });

    test('Test28', () => {
        const m = new ConfusableMatcher(getDefaultMap());
        const r = m.indexOfSync('N|\\|NC', 'N', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);
    });

    test('Test29', () => {
        const m = new ConfusableMatcher([
            ['N', '/\\/'],
            ['N', '//A'],
            ['N', '//'],
        ]);
        const r = m.indexOfSync('N/\\///AN', 'N', { matchRepeating: true, startIndex: 0 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(8);
    });

    test('Test30', () => {
        const m = new ConfusableMatcher([['N', '/']]);
        const r = m.indexOfSync('N////////////////////////////////////////////////', 'N', {
            matchRepeating: true,
            startFromEnd: false,
            startIndex: 0,
            statePushLimit: 60,
        });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toBeGreaterThan(10);
    });

    test('Test31', () => {
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher();

        let r = m.indexOfSync('X', 'X', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(1);

        r = m.indexOfSync('aX', 'X', { ...opts });
        expect(r.status).toEqual(EReturnStatus.WORD_BOUNDARY_FAIL_START);
        expect(r.start).toEqual(1);
        expect(r.size).toEqual(1);

        r = m.indexOfSync('Xa', 'X', { ...opts });
        expect(r.status).toEqual(EReturnStatus.WORD_BOUNDARY_FAIL_END);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(1);

        r = m.indexOfSync('a X', 'X', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(2);
        expect(r.size).toEqual(1);

        r = m.indexOfSync('X a', 'X', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(1);

        r = m.indexOfSync('X;duper', 'X', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(1);

        r = m.indexOfSync('yes\uFEFFX', 'X', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(4);
        expect(r.size).toEqual(1);
    });

    test('Test32', () => {
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            matchRepeating: true,
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher();

        let r = m.indexOfSync('QQQ', 'Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(3);

        r = m.indexOfSync('aQQQ', 'Q', { ...opts });
        expect(
            r.status === EReturnStatus.WORD_BOUNDARY_FAIL_START || r.status === EReturnStatus.WORD_BOUNDARY_FAIL_END
        ).toBeTruthy();
        expect(
            (r.start === 1 && r.size === 1) ||
                (r.start === 1 && r.size === 2) ||
                (r.start === 1 && r.size === 3) ||
                (r.start === 2 && r.size === 1) ||
                (r.start === 2 && r.size === 2) ||
                (r.start === 3 && r.size === 1)
        ).toBeTruthy();

        r = m.indexOfSync('QQQa', 'Q', { ...opts });
        expect(
            r.status === EReturnStatus.WORD_BOUNDARY_FAIL_START || r.status === EReturnStatus.WORD_BOUNDARY_FAIL_END
        ).toBeTruthy();
        expect(
            (r.start === 0 && r.size === 1) ||
                (r.start === 0 && r.size === 2) ||
                (r.start === 0 && r.size === 3) ||
                (r.start === 1 && r.size === 1) ||
                (r.start === 1 && r.size === 2) ||
                (r.start === 2 && r.size === 1)
        ).toBeTruthy();

        r = m.indexOfSync('a QQQ', 'Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(2);
        expect(r.size).toEqual(3);

        r = m.indexOfSync('QQQ a', 'Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(3);

        r = m.indexOfSync('QQQ;duper', 'Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(3);

        r = m.indexOfSync('yes\u202FQQQ', 'Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(4);
        expect(r.size).toEqual(3);
    });

    test('Test33', () => {
        const input = 'a QBQQ';
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            matchRepeating: true,
            startFromEnd: true,
            startIndex: input.length - 1,
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher([], ['B']);

        const r = m.indexOfSync(input, 'Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(2);
        expect(r.size).toEqual(4);
    });

    test('Test34', () => {
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher();

        let r = m.indexOfSync('SUPER', 'SUPER', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);

        r = m.indexOfSync('aSUPER', 'SUPER', { ...opts });
        expect(r.status).toEqual(EReturnStatus.WORD_BOUNDARY_FAIL_START);
        expect(r.start).toEqual(1);
        expect(r.size).toEqual(5);

        r = m.indexOfSync('SUPERa', 'SUPER', { ...opts });
        expect(r.status).toEqual(EReturnStatus.WORD_BOUNDARY_FAIL_END);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);

        r = m.indexOfSync('a SUPER', 'SUPER', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(2);
        expect(r.size).toEqual(5);

        r = m.indexOfSync('SUPER a', 'SUPER', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);

        r = m.indexOfSync('SUPER;duper', 'SUPER', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);

        r = m.indexOfSync('yes\u202FSUPER', 'SUPER', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(4);
        expect(r.size).toEqual(5);
    });

    test('Test35', () => {
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher([[' ', ' ']], [' ']);

        let r = m.indexOfSync('a Q Q f', 'Q Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(2);
        expect(r.size).toEqual(3);

        r = m.indexOfSync('aQ Q f', 'Q Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.WORD_BOUNDARY_FAIL_START);
        expect(r.start).toEqual(1);
        expect(r.size).toEqual(3);

        r = m.indexOfSync('a Q Qf', 'Q Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.WORD_BOUNDARY_FAIL_END);
        expect(r.start).toEqual(2);
        expect(r.size).toEqual(3);
    });

    test('Test36', () => {
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher([[' ', ' ']], [' ']);

        const r = m.indexOfSync('a Q Q Q f', 'Q Q', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start == 2 || r.start == 3).toBeTruthy();
        expect(r.size == 3 || r.size == 4).toBeTruthy();
    });

    test('Test37', () => {
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            matchRepeating: true,
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher([
            ['a', 'a'],
            ['s', 's'],
            [' ', ' '],
            ['i', 'i'],
            ['m', 'm'],
            ['p', 'p'],
        ]);

        const r = m.indexOfSync('as simp', 'simp', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(3);
        expect(r.size).toEqual(4);
    });

    test('Test38', () => {
        const opts: Partial<IIndexOfOptions> = {
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher();

        let r = m.indexOfSync('a', '', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(0);

        r = m.indexOfSync('', '', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(0);

        r = m.indexOfSync('', 'a', { ...opts });
        expect(r.status).toEqual(EReturnStatus.NO_MATCH);
    });

    test('Test39', () => {
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            matchRepeating: true,
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher([], ['f']);

        let r = m.indexOfSync('AABC', 'ABC', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(4);

        r = m.indexOfSync('AfABC', 'ABC', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);

        r = m.indexOfSync('ABCC', 'ABC', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(4);

        r = m.indexOfSync('ABCfC', 'ABC', { ...opts });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
    });

    test('Test40', () => {
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            matchRepeating: true,
            startFromEnd: true,
            statePushLimit: 50_000,
        };
        const m = new ConfusableMatcher([], ['f']);

        let r = m.indexOfSync('AABC', 'ABC', { ...opts, startIndex: 3 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(4);

        r = m.indexOfSync('AfABC', 'ABC', { ...opts, startIndex: 4 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);

        r = m.indexOfSync('ABCC', 'ABC', { ...opts, startIndex: 3 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(4);

        r = m.indexOfSync('ABCfC', 'ABC', { ...opts, startIndex: 4 });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);
    });

    test('Test41', () => {
        const m = new ConfusableMatcher(
            [
                ['s', 's'],
                ['i', '1'],
                ['m', 'm'],
                ['p', 'p'],
            ],
            [' ']
        );
        const r = m.indexOfSync('agdhsjs s 1 mmm ppps dhsjdhsd', 'simps', {
            matchOnWordBoundary: true,
            matchRepeating: true,
            statePushLimit: 50000,
        });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(8);
        expect(r.size).toEqual(12);
    });

    test('Test42', () => {
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            matchRepeating: true,
            statePushLimit: 50000,
        };
        let m = new ConfusableMatcher([], ['░']);
        let r = m.indexOfSync('░S░I░M░P░', 'SIMP', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(1);
        expect(r.size).toEqual(7);

        m = new ConfusableMatcher([], ['Ž']);
        r = m.indexOfSync('ŽSŽIŽMŽPŽ', 'SIMP', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(9);
    });

    test('Test43', () => {
        const map: Mapping[] = [
            ['S', '░'],
            ['S', 'Ž'],
        ];
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            matchRepeating: true,
            statePushLimit: 50000,
        };
        let m = new ConfusableMatcher(map, ['░']);
        let r = m.indexOfSync('░S░I░M░P░', 'SIMP', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(8);

        m = new ConfusableMatcher(map, ['Ž']);
        r = m.indexOfSync('ŽSŽIŽMŽPŽ', 'SIMP', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(9);
    });

    test('Test44', () => {
        const m = new ConfusableMatcher([[' ', ' ']]);
        const r = m.indexOfSync('A  B', ' B', {
            matchOnWordBoundary: true,
            matchRepeating: true,
            statePushLimit: 50000,
        });
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(2);
        expect(r.size).toEqual(2);
    });

    test('Test44.1', () => {
        const m = new ConfusableMatcher([['M', 'ⓜ']]);
        const r = m.indexOfSync('SIⓜP', 'SIMP');
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(4);
    });

    test('Test45', () => {
        const m = new ConfusableMatcher([], ['X']);
        const opts: Partial<IIndexOfOptions> = {
            matchOnWordBoundary: true,
            matchRepeating: true,
            statePushLimit: 50000,
        };

        let r = m.indexOfSync('XXABC', 'ABC', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(0);
        expect(r.size).toEqual(5);

        r = m.indexOfSync('X XABC', 'ABC', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(2);
        expect(r.size).toEqual(4);

        r = m.indexOfSync('X૰XABC', 'ABC', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(2);
        expect(r.size).toEqual(4);

        r = m.indexOfSync(' X XABC', 'ABC', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(3);
        expect(r.size).toEqual(4);

        r = m.indexOfSync(' XXABC', 'ABC', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(1);
        expect(r.size).toEqual(5);

        r = m.indexOfSync(' XX ABC', 'ABC', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(4);
        expect(r.size).toEqual(3);

        r = m.indexOfSync('XXXX XXABC', 'ABC', opts);
        expect(r.status).toEqual(EReturnStatus.MATCH);
        expect(r.start).toEqual(5);
        expect(r.size).toEqual(5);
    });
});

function getDefaultMap(): Mapping[] {
    const map: Mapping[] = [
        ['N', '/[()[]]/'],
        ['N', '\u{000000f1}'],
        ['N', '|\\|'],
        ['N', '\u{00000245}\u{0000002f}'],
        ['N', '/IJ'],
        ['N', '/|/'],
    ];

    for (const n of [
        '\u{000004c5}',
        '\u{000003a0}',
        '\u{00000418}',
        '\u{0001d427}',
        '\u{0001d45b}',
        '\u{0001d48f}',
        '\u{0001d4c3}',
        '\u{0001d4f7}',
        '\u{0001d52b}',
        '\u{0001d55f}',
        '\u{0001d593}',
        '\u{0001d5c7}',
        '\u{0001d5fb}',
        '\u{0001d62f}',
        '\u{0001d663}',
        '\u{0001d697}',
        '\u{00000578}',
        '\u{0000057c}',
        '\u{0000ff2e}',
        '\u{00002115}',
        '\u{0001d40d}',
        '\u{0001d441}',
        '\u{0001d475}',
        '\u{0001d4a9}',
        '\u{0001d4dd}',
        '\u{0001d511}',
        '\u{0001d579}',
        '\u{0001d5ad}',
        '\u{0001d5e1}',
        '\u{0001d615}',
        '\u{0001d649}',
        '\u{0001d67d}',
        '\u{0000039d}',
        '\u{0001d6b4}',
        '\u{0001d6ee}',
        '\u{0001d728}',
        '\u{0001d762}',
        '\u{0001d79c}',
        '\u{0000a4e0}',
        '\u{00000143}',
        '\u{00000145}',
        '\u{00000147}',
        '\u{0000014b}',
        '\u{0000019d}',
        '\u{000001f8}',
        '\u{00000220}',
        '\u{0000039d}',
        '\u{00001e44}',
        '\u{00001e46}',
        '\u{00001e48}',
        '\u{00001e4a}',
        '\u{000020a6}',
        '\u{00001f20}',
        '\u{00001f21}',
        '\u{00001f22}',
        '\u{00001f23}',
        '\u{00001f24}',
        '\u{00001f25}',
        '\u{00001f26}',
        '\u{00001f27}',
        '\u{00001f74}',
        '\u{00001f75}',
        '\u{00001f90}',
        '\u{00001f91}',
        '\u{00001f92}',
        '\u{00001f93}',
        '\u{00001f94}',
        '\u{00001f95}',
        '\u{00001f96}',
        '\u{00001f97}',
        '\u{00001fc2}',
        '\u{00001fc3}',
        '\u{00001fc4}',
        '\u{00001fc6}',
        '\u{00001fc7}',
        '\u{000000f1}',
        '\u{00000144}',
        '\u{00000146}',
        '\u{00000148}',
        '\u{00000149}',
        '\u{0000014a}',
        '\u{0000019e}',
        '\u{000001f9}',
        '\u{00000235}',
        '\u{00000272}',
        '\u{00000273}',
        '\u{00000274}',
        '\u{00001d70}',
        '\u{00001d87}',
        '\u{00001e45}',
        '\u{00001e47}',
        '\u{00001e49}',
        '\u{00001e4b}',
    ]) {
        map.push(['N', n]);
    }

    for (const i of [
        '\u{00001ec8}',
        '\u{00000079}',
        '\u{00000069}',
        '\u{00000031}',
        '\u{0000007c}',
        '\u{0000006c}',
        '\u{0000006a}',
        '\u{00000021}',
        '\u{0000002f}',
        '\u{0000005c}\u{0000005c}',
        '\u{0000ff49}',
        '\u{000000a1}',
        '\u{00002170}',
        '\u{00002139}',
        '\u{00002148}',
        '\u{0001d422}',
        '\u{0001d456}',
        '\u{0001d48a}',
        '\u{0001d4be}',
        '\u{0001d4f2}',
        '\u{0001d526}',
        '\u{0001d55a}',
        '\u{0001d58e}',
        '\u{0001d5c2}',
        '\u{0001d5f6}',
        '\u{0001d62a}',
        '\u{0001d65e}',
        '\u{0001d692}',
        '\u{00000131}',
        '\u{0001d6a4}',
        '\u{0000026a}',
        '\u{00000269}',
        '\u{000003b9}',
        '\u{00001fbe}',
        '\u{0000037a}',
        '\u{0001d6ca}',
        '\u{0001d704}',
        '\u{0001d73e}',
        '\u{0001d778}',
        '\u{0001d7b2}',
        '\u{00000456}',
        '\u{000024be}',
        '\u{0000a647}',
        '\u{000004cf}',
        '\u{0000ab75}',
        '\u{000013a5}',
        '\u{00000263}',
        '\u{00001d8c}',
        '\u{0000ff59}',
        '\u{0001d432}',
        '\u{0001d466}',
        '\u{0001d49a}',
        '\u{0001d4ce}',
        '\u{0001d502}',
        '\u{0001d536}',
        '\u{0001d56a}',
        '\u{0001d59e}',
        '\u{0001d5d2}',
        '\u{0001d606}',
        '\u{0001d63a}',
        '\u{0001d66e}',
        '\u{0001d6a2}',
        '\u{0000028f}',
        '\u{00001eff}',
        '\u{0000ab5a}',
        '\u{000003b3}',
        '\u{0000213d}',
        '\u{0001d6c4}',
        '\u{0001d6fe}',
        '\u{0001d738}',
        '\u{0001d772}',
        '\u{0001d7ac}',
        '\u{00000443}',
        '\u{000004af}',
        '\u{000010e7}',
        '\u{0000ff39}',
        '\u{0001d418}',
        '\u{0001d44c}',
        '\u{0001d480}',
        '\u{0001d4b4}',
        '\u{0001d4e8}',
        '\u{0001d51c}',
        '\u{0001d550}',
        '\u{0001d584}',
        '\u{0001d5b8}',
        '\u{0001d5ec}',
        '\u{0001d620}',
        '\u{0001d654}',
        '\u{0001d688}',
        '\u{000003a5}',
        '\u{000003d2}',
        '\u{0001d6bc}',
        '\u{0001d6f6}',
        '\u{0001d730}',
        '\u{0001d76a}',
        '\u{0001d7a4}',
        '\u{00002ca8}',
        '\u{00000423}',
        '\u{000004ae}',
        '\u{000013a9}',
        '\u{000013bd}',
        '\u{0000a4ec}',
        '\u{00000176}',
        '\u{00000178}',
        '\u{000001b3}',
        '\u{00000232}',
        '\u{0000024e}',
        '\u{0000028f}',
        '\u{00001e8e}',
        '\u{00001ef2}',
        '\u{00001ef4}',
        '\u{00001ef6}',
        '\u{00001ef8}',
        '\u{0000ff39}',
        '\u{000000cc}',
        '\u{000000cd}',
        '\u{000000ce}',
        '\u{000000cf}',
        '\u{00000128}',
        '\u{0000012a}',
        '\u{0000012c}',
        '\u{0000012e}',
        '\u{00000130}',
        '\u{00000196}',
        '\u{00000197}',
        '\u{000001cf}',
        '\u{00000208}',
        '\u{0000020a}',
        '\u{0000026a}',
        '\u{0000038a}',
        '\u{00000390}',
        '\u{00000399}',
        '\u{000003aa}',
        '\u{00000406}',
        '\u{0000040d}',
        '\u{00000418}',
        '\u{00000419}',
        '\u{000004e2}',
        '\u{000004e4}',
        '\u{00001e2c}',
        '\u{00001e2e}',
        '\u{00001ec8}',
        '\u{00001eca}',
        '\u{00001fd8}',
        '\u{00001fd9}',
        '\u{00002160}',
        '\u{0000ff29}',
        '\u{000030a7}',
        '\u{000030a8}',
        '\u{0000ff6a}',
        '\u{0000ff74}',
        '\u{000000ec}',
        '\u{000000ed}',
        '\u{000000ee}',
        '\u{000000ef}',
        '\u{00000129}',
        '\u{0000012b}',
        '\u{0000012d}',
        '\u{0000012f}',
        '\u{00000131}',
        '\u{000001d0}',
        '\u{00000209}',
        '\u{0000020b}',
        '\u{00000268}',
        '\u{00000269}',
        '\u{00000365}',
        '\u{000003af}',
        '\u{000003ca}',
        '\u{00000438}',
        '\u{00000439}',
        '\u{00000456}',
        '\u{0000045d}',
        '\u{000004e3}',
        '\u{000004e5}',
        '\u{00001e2d}',
        '\u{00001e2f}',
        '\u{00001ec9}',
        '\u{00001ecb}',
        '\u{00001f30}',
        '\u{00001f31}',
        '\u{00001f32}',
        '\u{00001f33}',
        '\u{00001f34}',
        '\u{00001f35}',
        '\u{00001f36}',
        '\u{00001f37}',
        '\u{00001f76}',
        '\u{00001f77}',
        '\u{00001fbe}',
        '\u{00001fd0}',
        '\u{00001fd1}',
        '\u{00001fd2}',
        '\u{00001fd3}',
        '\u{00001fd6}',
        '\u{00001fd7}',
        '\u{0000ff49}',
        '\u{00001d85}',
        '\u{00001e37}',
        '\u{00001e39}',
        '\u{00001e3b}',
        '\u{00001e3d}',
        '\u{000000fd}',
        '\u{000000ff}',
        '\u{00000177}',
        '\u{000001b4}',
        '\u{00000233}',
        '\u{0000024f}',
        '\u{0000028e}',
        '\u{000002b8}',
        '\u{00001e8f}',
        '\u{00001e99}',
        '\u{00001ef3}',
        '\u{00001ef5}',
        '\u{00001ef7}',
        '\u{00001ef9}',
        '\u{0000ff59}',
    ]) {
        map.push(['I', i]);
    }

    for (const g of [
        '\u{0000006b}',
        '\u{00000067}',
        '\u{00000071}',
        '\u{00000034}',
        '\u{00000036}',
        '\u{00000039}',
        '\u{0000011f}',
        '\u{00000d6b}',
        '\u{0000ff47}',
        '\u{0000210a}',
        '\u{0001d420}',
        '\u{0001d454}',
        '\u{0001d488}',
        '\u{0001d4f0}',
        '\u{0001d524}',
        '\u{0001d558}',
        '\u{0001d58c}',
        '\u{0001d5c0}',
        '\u{0001d5f4}',
        '\u{0001d628}',
        '\u{0001d65c}',
        '\u{0001d690}',
        '\u{00000261}',
        '\u{00001d83}',
        '\u{0000018d}',
        '\u{00000581}',
        '\u{0001d406}',
        '\u{0001d43a}',
        '\u{0001d46e}',
        '\u{0001d4a2}',
        '\u{0001d4d6}',
        '\u{0001d50a}',
        '\u{0001d53e}',
        '\u{0001d572}',
        '\u{0001d5a6}',
        '\u{0001d5da}',
        '\u{00004e48}',
        '\u{0001d60e}',
        '\u{0001d642}',
        '\u{0001d676}',
        '\u{0000050c}',
        '\u{000013c0}',
        '\u{000013f3}',
        '\u{0000a4d6}',
        '\u{0000011c}',
        '\u{0000011e}',
        '\u{00000120}',
        '\u{00000122}',
        '\u{00000193}',
        '\u{000001e4}',
        '\u{000001e6}',
        '\u{000001f4}',
        '\u{0000029b}',
        '\u{00000393}',
        '\u{00000413}',
        '\u{00001e20}',
        '\u{0000ff27}',
        '\u{000013b6}',
        '\u{0000011d}',
        '\u{0000011f}',
        '\u{00000121}',
        '\u{00000123}',
        '\u{000001e5}',
        '\u{000001e7}',
        '\u{000001f5}',
        '\u{00000260}',
        '\u{00000261}',
        '\u{00000262}',
        '\u{00000040}',
    ]) {
        map.push(['G', g]);
    }

    for (const e of [
        '\u{00001ec0}',
        '\u{000003a3}',
        '\u{0000039e}',
        '\u{00000065}',
        '\u{00000033}',
        '\u{00000075}',
        '\u{0000212e}',
        '\u{0000ff45}',
        '\u{0000212f}',
        '\u{00002147}',
        '\u{0001d41e}',
        '\u{0001d452}',
        '\u{0001d486}',
        '\u{0001d4ee}',
        '\u{0001d522}',
        '\u{0001d556}',
        '\u{0001d58a}',
        '\u{0001d5be}',
        '\u{0001d5f2}',
        '\u{0001d626}',
        '\u{0001d65a}',
        '\u{0001d68e}',
        '\u{0000ab32}',
        '\u{00000435}',
        '\u{000004bd}',
        '\u{000022ff}',
        '\u{0000ff25}',
        '\u{00002130}',
        '\u{0001d404}',
        '\u{0001d438}',
        '\u{0001d46c}',
        '\u{0001d4d4}',
        '\u{0001d508}',
        '\u{0001d53c}',
        '\u{0001d570}',
        '\u{0001d5a4}',
        '\u{0001d5d8}',
        '\u{0001d60c}',
        '\u{0001d640}',
        '\u{0001d674}',
        '\u{00000395}',
        '\u{0001d6ac}',
        '\u{0001d6e6}',
        '\u{0001d720}',
        '\u{0001d75a}',
        '\u{0001d794}',
        '\u{00000415}',
        '\u{00002d39}',
        '\u{000013ac}',
        '\u{0000a4f0}',
        '\u{000000c8}',
        '\u{000000c9}',
        '\u{000000ca}',
        '\u{000000cb}',
        '\u{00000112}',
        '\u{00000114}',
        '\u{00000116}',
        '\u{00000118}',
        '\u{0000011a}',
        '\u{0000018e}',
        '\u{00000190}',
        '\u{00000204}',
        '\u{00000206}',
        '\u{00000228}',
        '\u{00000246}',
        '\u{00000388}',
        '\u{0000042d}',
        '\u{000004ec}',
        '\u{00001e14}',
        '\u{00001e16}',
        '\u{00001e18}',
        '\u{00001e1a}',
        '\u{00001e1c}',
        '\u{00001eb8}',
        '\u{00001eba}',
        '\u{00001ebc}',
        '\u{00001ebe}',
        '\u{00001ec0}',
        '\u{00001ec2}',
        '\u{00001ec4}',
        '\u{00001ec6}',
        '\u{00001f18}',
        '\u{00001f19}',
        '\u{00001f1a}',
        '\u{00001f1b}',
        '\u{00001f1c}',
        '\u{00001f1d}',
        '\u{00001fc8}',
        '\u{00001fc9}',
        '\u{000000e8}',
        '\u{000000e9}',
        '\u{000000ea}',
        '\u{000000eb}',
        '\u{00000113}',
        '\u{00000115}',
        '\u{00000117}',
        '\u{00000119}',
        '\u{0000011b}',
        '\u{0000018f}',
        '\u{00000205}',
        '\u{00000207}',
        '\u{00000229}',
        '\u{00000247}',
        '\u{00000258}',
        '\u{0000025b}',
        '\u{0000025c}',
        '\u{0000025d}',
        '\u{0000025e}',
        '\u{00000364}',
        '\u{000003ad}',
        '\u{000003b5}',
        '\u{00000435}',
        '\u{0000044d}',
        '\u{000004ed}',
        '\u{00001e15}',
        '\u{00001e17}',
        '\u{00001e19}',
        '\u{00001e1b}',
        '\u{00001e1d}',
        '\u{00001eb9}',
        '\u{00001ebb}',
        '\u{00001ebd}',
        '\u{00001ebf}',
        '\u{00001ec1}',
        '\u{00001ec3}',
        '\u{00001ec5}',
        '\u{00001ec7}',
        '\u{00001f10}',
        '\u{00001f11}',
        '\u{00001f12}',
        '\u{00001f13}',
        '\u{00001f14}',
        '\u{00001f15}',
        '\u{00001f72}',
        '\u{00001f73}',
    ]) {
        map.push(['E', e]);
    }

    for (const r of [
        '\u{00000403}',
        '\u{0000042f}',
        '\u{00000072}',
        '\u{0001d42b}',
        '\u{0001d45f}',
        '\u{0001d493}',
        '\u{0001d4c7}',
        '\u{0001d4fb}',
        '\u{0001d52f}',
        '\u{0001d563}',
        '\u{0001d597}',
        '\u{0001d5cb}',
        '\u{0001d5ff}',
        '\u{0001d633}',
        '\u{0001d667}',
        '\u{0001d69b}',
        '\u{0000ab47}',
        '\u{0000ab48}',
        '\u{00001d26}',
        '\u{00002c85}',
        '\u{00000433}',
        '\u{0000ab81}',
        '\u{0000211b}',
        '\u{0000211c}',
        '\u{0000211d}',
        '\u{0001d411}',
        '\u{0001d445}',
        '\u{0001d479}',
        '\u{0001d4e1}',
        '\u{0001d57d}',
        '\u{0001d5b1}',
        '\u{0001d5e5}',
        '\u{0001d619}',
        '\u{0001d64d}',
        '\u{0001d681}',
        '\u{000001a6}',
        '\u{000013a1}',
        '\u{000013d2}',
        '\u{000104b4}',
        '\u{00001587}',
        '\u{0000a4e3}',
        '\u{00000154}',
        '\u{00000156}',
        '\u{00000158}',
        '\u{00000210}',
        '\u{00000212}',
        '\u{0000024c}',
        '\u{00000280}',
        '\u{00000281}',
        '\u{00001e58}',
        '\u{00001e5a}',
        '\u{00001e5c}',
        '\u{00001e5e}',
        '\u{00002c64}',
        '\u{0000ff32}',
        '\u{000013a1}',
        '\u{00000155}',
        '\u{00000157}',
        '\u{00000159}',
        '\u{00000211}',
        '\u{00000213}',
        '\u{0000024d}',
        '\u{00000279}',
        '\u{0000027a}',
        '\u{0000027b}',
        '\u{0000027c}',
        '\u{0000027d}',
        '\u{000016b1}',
        '\u{00001875}',
        '\u{00001d72}',
        '\u{00001d73}',
        '\u{00001d89}',
        '\u{00001e59}',
        '\u{00001e5b}',
        '\u{00001e5d}',
        '\u{00001e5f}',
        '\u{0000ff52}',
    ]) {
        map.push(['R', r]);
    }

    return map;
}
