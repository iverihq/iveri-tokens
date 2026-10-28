/**
 * `@iveri/tokens` is compiled into browser bundles and into two React Native apps. A single runtime dependency —
 * `class-validator`, `@nestjs/common`, anything reaching for `node:` builtins — would either
 * break those bundles or quietly bloat them.
 *
 * The rule is stated in the workspace CLAUDE.md; this is the enforcement. It runs in `test`,
 * so CI fails on the PR that adds the dependency rather than on the frontend build weeks later.
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(PACKAGE_ROOT, 'package.json'), 'utf8'));

for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    const declared = Object.keys(manifest[field] ?? {});
    assert.deepEqual(
        declared,
        [],
        `@iveri/tokens must declare no ${field}; found: ${declared.join(', ')}. ` +
            'Plain data and pure helpers only — a token that needs a dependency is not a token.',
    );
}

/** Every module specifier the emitted JavaScript still requires at runtime. */
const collectImports = (directory) => {
    const specifiers = new Set();

    const walk = (current) => {
        for (const entry of readdirSync(current)) {
            const path = join(current, entry);
            if (statSync(path).isDirectory()) {
                walk(path);
                continue;
            }
            if (extname(path) !== '.js') {
                continue;
            }
            const source = readFileSync(path, 'utf8');
            for (const match of source.matchAll(/(?:require\(|from\s+)['"]([^'"]+)['"]/g)) {
                specifiers.add(match[1]);
            }
        }
    };

    walk(directory);
    return [...specifiers];
};

const distRoot = resolve(PACKAGE_ROOT, 'dist');
const external = collectImports(distRoot).filter((specifier) => !specifier.startsWith('.'));

assert.deepEqual(
    external,
    [],
    `The compiled output imports from outside the package: ${external.join(', ')}. ` +
        'Emitted JavaScript must be self-contained.',
);

console.log('@iveri/tokens: zero runtime dependencies confirmed');
