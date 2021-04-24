/* cSpell: disable */
module.exports = {
    hooks: {
        'pre-commit': 'yarn lint-staged -c .lint-stagedrc.js',
    },
};
