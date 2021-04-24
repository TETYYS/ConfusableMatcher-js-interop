module.exports = {
    root: true,
    plugins: ['eslint-comments', 'import', 'simple-import-sort', 'sort-keys-fix', 'prettier'],
    env: {
        es2020: true,
        node: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    extends: [
        /* ESLint */
        'eslint:recommended',

        /* Import */
        'plugin:import/errors',
        'plugin:import/warnings',

        /* Prettier */
        'prettier',
    ],
    parserOptions: {
        sourceType: 'module',
    },
    rules: {
        /* ESLint */
        'curly': ['warn', 'all'],
        'no-useless-escape': 'warn',
        'no-mixed-operators': [
            'error',
            {
                groups: [
                    ['&', '|', '^', '~', '<<', '>>', '>>>'],
                    ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
                    ['&&', '||'],
                    ['in', 'instanceof'],
                ],
                allowSamePrecedence: true,
            },
        ],
        'no-constant-condition': 'off',

        /* ESLint Comments */
        'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
        'eslint-comments/no-aggregating-enable': 'error',
        'eslint-comments/no-duplicate-disable': 'error',
        'eslint-comments/no-unlimited-disable': 'error',
        'eslint-comments/no-unused-disable': 'warn',
        'eslint-comments/no-unused-enable': 'warn',
        'eslint-comments/no-use': [
            'warn',
            { allow: ['eslint-disable', 'eslint-disable-line', 'eslint-disable-next-line', 'eslint-enable'] },
        ],

        /* Imports */
        'import/named': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-unresolved': 'warn',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-absolute-path': 'error',
        'import/no-amd': 'error',
        'import/no-default-export': 'error',
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: true, peerDependencies: true, optionalDependencies: false },
        ],
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-named-export': 'off',
        'import/no-self-import': 'error',
        'import/prefer-default-export': 'off',

        /* Sorting */
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',

        /* Object Formatting */
        'object-shorthand': ['warn', 'always', { avoidQuotes: true }],

        /* Sort Object keys */
        'sort-keys': [
            'warn',
            'asc',
            {
                caseSensitive: true,
                natural: false,
                minKeys: 2,
            },
        ],
        'sort-keys-fix/sort-keys-fix': 'warn',

        /* Prettier */
        'prettier/prettier': 'warn',
    },
    overrides: [
        {
            /* Config Files */
            files: '*rc.js',
            rules: {
                'sort-keys': 'off',
                'sort-keys-fix/sort-keys-fix': 'off',
            },
        },
        {
            /* Test Files */
            files: ['src/**/*.{spec,test}.[tj]s', 'src/**/__tests__/*/*.[tj]s'],
            plugins: ['jest'],
            env: {
                'jest/globals': true,
            },
            rules: {
                'jest/no-disabled-tests': 'warn',
                'jest/no-focused-tests': 'error',
                'jest/no-alias-methods': 'error',
                'jest/no-identical-title': 'error',
                'jest/no-jasmine-globals': 'error',
                'jest/no-jest-import': 'error',
                'jest/no-test-prefixes': 'error',
                'jest/no-test-return-statement': 'error',
                'jest/prefer-to-have-length': 'warn',
                'jest/prefer-spy-on': 'error',
                'jest/valid-expect': 'error',
            },
        },
        {
            /* TypeScript */
            files: ['packages/**/*.ts'],
            plugins: ['@typescript-eslint'],
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:import/typescript',
                'prettier',
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: ['./tsconfig.eslint.json', './tsconfig.json'],
                sourceType: 'module',
                tsconfigRootDir: __dirname,
                warnOnUnsupportedTypeScriptVersion: false,
            },
            rules: {
                '@typescript-eslint/ban-ts-comment': [
                    'error',
                    {
                        'minimumDescriptionLength': 5,
                        'ts-check': false,
                        'ts-expect-error': 'allow-with-description',
                        'ts-ignore': true,
                        'ts-nocheck': true,
                    },
                ],
                /* TypeScript */
                '@typescript-eslint/ban-types': [
                    'warn',
                    {
                        extendDefaults: false,
                        types: {
                            Boolean: {
                                fixWith: 'boolean',
                                message: 'Use boolean instead',
                            },
                            Function: {
                                message: [
                                    'The `Function` type accepts any function-like value.',
                                    'It provides no type safety when calling the function, which can be a common source of bugs.',
                                    'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
                                    'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
                                ].join('\n'),
                            },
                            Number: {
                                fixWith: 'number',
                                message: 'Use number instead',
                            },
                            Object: {
                                message: [
                                    'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.',
                                    '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
                                    '- If you want a type meaning "any value", you probably want `unknown` instead.',
                                ].join('\n'),
                            },
                            String: {
                                fixWith: 'string',
                                message: 'Use string instead',
                            },
                            Symbol: {
                                fixWith: 'symbol',
                                message: 'Use symbol instead',
                            },
                        },
                    },
                ],
                '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
                '@typescript-eslint/explicit-function-return-type': ['off'],
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
                '@typescript-eslint/no-duplicate-imports': 'error',
                '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
                '@typescript-eslint/no-explicit-any': 'error',
                '@typescript-eslint/no-floating-promises': 'warn',
                '@typescript-eslint/no-misused-promises': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'warn',

                '@typescript-eslint/no-unsafe-call': 'warn',
                '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

                '@typescript-eslint/naming-convention': [
                    'warn',
                    /* Camel Case Fields */
                    { format: ['camelCase', 'UPPER_CASE'], selector: 'variableLike' },

                    /* Private Fields _ */
                    {
                        modifiers: ['private'],
                        selector: 'memberLike',
                        format: ['camelCase', 'UPPER_CASE'],
                        leadingUnderscore: 'require',
                    },

                    /* Interfaces */
                    {
                        format: ['PascalCase'],
                        selector: 'interface',
                    },

                    /* Boolean Naming */
                    {
                        selector: 'variable',
                        format: ['PascalCase'],
                        types: ['boolean'],
                        prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
                    },
                ],

                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'warn',
                '@typescript-eslint/prefer-nullish-coalescing': 'error',
                '@typescript-eslint/no-unsafe-return': 'warn',
                '@typescript-eslint/prefer-optional-chain': 'error',
                '@typescript-eslint/prefer-as-const': 'error',
                '@typescript-eslint/unbound-method': 'off',
                '@typescript-eslint/restrict-plus-operands': 'warn',
                'no-duplicate-imports': 'off',
                '@typescript-eslint/restrict-template-expressions': 'off',
            },
        },
    ],
};
