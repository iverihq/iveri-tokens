/**
 * The package root declares `"type": "commonjs"`, which Node applies to every `.js` file
 * beneath it — including the ESM build. These two marker files scope the module system per
 * directory so `dist/esm` is treated as ESM and `dist/cjs` as CommonJS.
 *
 * Without them the `import` condition in `exports` resolves to a file Node then parses as
 * CommonJS, and the package fails at runtime with "Cannot use import statement outside a
 * module".
 */
import assert from 'node:assert/strict';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const MARKERS = [
    ['dist/cjs', 'commonjs'],
    ['dist/esm', 'module'],
];

for (const [directory, type] of MARKERS) {
    const target = resolve(PACKAGE_ROOT, directory);
    assert.ok(existsSync(target), `${directory} was not emitted — did the tsc build fail?`);
    writeFileSync(resolve(target, 'package.json'), `${JSON.stringify({ type }, null, 4)}\n`, 'utf8');
}

console.log('@iveri/tokens: dist/cjs and dist/esm marked');
