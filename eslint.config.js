const { base } = require('@iveri/eslint-config');

module.exports = [
    ...base,
    {
        languageOptions: {
            parserOptions: { tsconfigRootDir: __dirname },
        },
    },
];
