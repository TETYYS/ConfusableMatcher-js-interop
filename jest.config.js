'use strict';

module.exports = {
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.{js,ts}'],
    coverageReporters: ['text-summary', 'lcov'],
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/build', '<rootDir>/coverage'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]s$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
