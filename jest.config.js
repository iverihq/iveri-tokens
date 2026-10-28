module.exports = {
    rootDir: 'src',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    // Source imports carry explicit `.js` extensions so the ESM build resolves under Node.
    // Jest resolves specifiers literally, so strip the extension back off for it.
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/../tsconfig.json' }],
    },
    collectCoverageFrom: ['**/*.ts'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
};
