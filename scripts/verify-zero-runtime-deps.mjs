/**
 * `@iveri/tokens` is compiled into browser bundles and into React Native apps through Metro. A single runtime
 * dependency — `class-validator`, `@nestjs/common`, anything reaching for `node:` builtins — would
 * either break those bundles or quietly bloat them.
 *
 * The rule is stated in the workspace CLAUDE.md; this is the enforcement. It runs in `build`, so
 * CI fails on the PR that adds the dependency rather than on a frontend build weeks later.
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PACKAGE_ROOT = resolve(import.meta.dirname, '..');
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

/** `from '…'`, `import '…'` and `import('…')` — every form an emitted module can load another by. */
const SPECIFIER = /(?:\bfrom\s+|\bimport\s*\(?\s*)['"]([^'"]+)['"]/g;

/**
 * Every specifier the emitted output refers to. Declarations are scanned as well as JavaScript:
 * `import type` is erased from `.js` but survives into `.d.ts`, and a type imported from a
 * package the consumer does not have fails their type check just as surely.
 */
const collectSpecifiers = (directory) =>
    readdirSync(directory, { recursive: true })
        .filter((path) => path.endsWith('.js') || path.endsWith('.d.ts'))
        .flatMap((path) =>
            [...readFileSync(join(directory, path), 'utf8').matchAll(SPECIFIER)].map((match) => match[1]),
        );

const external = [...new Set(collectSpecifiers(resolve(PACKAGE_ROOT, 'dist')))].filter(
    (specifier) => !specifier.startsWith('.'),
);

assert.deepEqual(
    external,
    [],
    `The compiled output refers to modules outside the package: ${external.join(', ')}. ` +
        'Emitted JavaScript and declarations must be self-contained.',
);

console.log('@iveri/tokens: zero runtime dependencies confirmed');
