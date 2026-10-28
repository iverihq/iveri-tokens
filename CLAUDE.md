# @iveri/tokens — repo rules

Read `~/Desktop/CODING/CLAUDE.md` and `~/Desktop/CODING/IVERI/CLAUDE.md` first. This package is
one of the six public `@iveri/*` repos: **merge with a merge commit, never a squash**, so the
annotated release tags stay reachable from `main`.

## What may go in

**Plain data and pure functions, nothing else.** `scripts/verify-zero-runtime-deps.mjs` fails the
build on a dependency of any kind, including a peer — this is compiled into browser bundles, into
a Tailwind config that jiti loads as CommonJS, and into two React Native apps through Metro.

A token belongs here when **both** platforms genuinely share it. A shadow does not: it is
`box-shadow` on the web and `shadowOffset`/`elevation` on React Native, the same intent expressed
twice with nothing to extract. Nor does a font stack: one platform names a list and lets the
browser substitute per glyph, the other names a single face per run of text and has no fallback
at all.

## `verify-loadable.mjs` is the check that matters

It loads the built artefact through **both** loaders and asserts the two agree. `@iveri/react-kit`
shipped twice with a defect that lived only in the emitted output — a directory import Node ESM
rejects, then an entry point the CJS loader could not see — and in both cases `tsc` was right to
pass, because the source was legal under the `moduleResolution` it compiles with.

**Checking the source answers a different question from loading the artefact.** Keep it in
`build`, not just in `test`.

## Decisions worth not re-litigating

- **Hex is canonical.** The web derives channel triplets with `toRgbChannels`; React Native uses
  the hex directly. Shipping triplets would make the mobile apps parse them; shipping CSS would be
  unusable from React Native at all.
- **`productColor` is a separate export**, so a panel cannot reach a navy hero card and a gold
  button by accident. An admin console does not open on one and should not start.
- **`productColor.hero` equals `color.accentHover`**, and a spec pins it. The two product web apps
  wrote `#17285d` inline fourteen times between them — three parts in 255 from the navy the
  palette already had. Collapsing the near-miss shrinks the palette instead of growing it.
- **`positive` / `caution` / `critical`**, matching the design standard and six web panels. The
  mobile apps' `success` / `warning` / `danger` are aliases in their own `theme.ts`.
- **The radii and the motion scale are a copy of `design-system/tokens.json`**, which is outside
  any package and unpublished, so a change belongs in both places deliberately. `color.spec.ts`
  pins them because the kit's first preset invented four numbers the standard had already set.

## Releasing

`npm version <patch|minor|major>` then `git push --follow-tags`. CI checks the tag matches
`package.json` before publishing. npm versions are permanent.
