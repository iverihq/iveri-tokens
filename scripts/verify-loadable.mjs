/**
 * Loads the built artefact the ways its consumers do: imported (Vite, Node) and required (Metro,
 * which resolves the `require` and `default` conditions).
 *
 * `@iveri/react-kit` shipped twice with a defect that lived only in the emitted output — once a
 * directory import Node ESM rejects, once an entry point the CJS loader could not see — and in
 * both cases `tsc` was right to pass, because the source was legal under the `moduleResolution`
 * it compiles with. Only loading the thing answers the question.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const PACKAGE_ROOT = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(readFileSync(resolve(PACKAGE_ROOT, 'package.json'), 'utf8'));
const require = createRequire(import.meta.url);

// Left behind by a dual build, each of these points at a file that no longer exists.
for (const field of ['main', 'module', 'types', 'typesVersions']) {
    assert.ok(!(field in manifest), `package.json still declares "${field}"; the exports map is the only entry.`);
}

// `default` rather than `import`: an `import`-only map builds every web app and breaks Metro.
const conditions = manifest.exports['.'];
assert.deepEqual(
    Object.keys(conditions),
    ['types', 'default'],
    'The entry point must offer exactly { types, default }.',
);
for (const target of Object.values(conditions)) {
    assert.ok(existsSync(resolve(PACKAGE_ROOT, target)), `The entry point names ${target}, which was not emitted.`);
}

// Both resolve through the exports map by self-reference, as they would from node_modules.
const imported = await import(manifest.name);
const required = require(manifest.name);

for (const [label, loaded] of [
    ['imported', imported],
    ['required', required],
]) {
    assert.equal(typeof loaded.toRgbChannels, 'function', `${label}, the build does not export toRgbChannels`);
    assert.equal(loaded.color.accent, '#1B2D72', `${label}, the build does not export the palette`);
    assert.equal(loaded.productColor.gold, '#F6C76D', `${label}, the build does not export the product palette`);
    assert.equal(loaded.radius.card, 12, `${label}, the build does not export the scale`);
}

// One build, so both loaders must hand back the same module rather than two copies of the palette.
assert.equal(required.color, imported.color, 'import and require loaded two copies of the module');

console.log('@iveri/tokens: the build loads imported and required, as one module');
