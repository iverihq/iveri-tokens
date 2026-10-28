/**
 * Loads the built artefact through **both** loaders.
 *
 * `@iveri/react-kit` shipped twice with a defect that lived only in the emitted output —
 * once a directory import Node ESM rejects, once an entry point the CJS loader could not see —
 * and in both cases `tsc` was right to pass, because the source was legal under the
 * `moduleResolution` it compiles with. Only loading the thing answers the question.
 *
 * It matters more here than anywhere: this package is consumed by browser bundles, by a Tailwind
 * config jiti loads as CommonJS, and by Metro in two React Native apps.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

const esm = await import(pathToFileURL(resolve(PACKAGE_ROOT, 'dist/esm/index.js')).href);
const cjs = require(resolve(PACKAGE_ROOT, 'dist/cjs/index.js'));

for (const [label, loaded] of [
    ['esm', esm],
    ['cjs', cjs],
]) {
    assert.equal(typeof loaded.toRgbChannels, 'function', `${label} build does not export toRgbChannels`);
    assert.equal(loaded.color.accent, '#1B2D72', `${label} build does not export the palette`);
    assert.equal(loaded.productColor.gold, '#F6C76D', `${label} build does not export the product palette`);
    assert.equal(loaded.radius.card, 12, `${label} build does not export the scale`);
}

// The two builds must agree, which a copy-paste of one tsconfig into the other can break.
assert.deepEqual({ ...esm.color }, { ...cjs.color }, 'the ESM and CJS builds disagree about the palette');

console.log('verify-loadable: both builds load and agree');
