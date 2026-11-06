# @iveri/tokens

The Iveri design tokens — **one** copy of the palette, the radii and the motion scale, readable
from a browser bundle, a Tailwind theme and React Native alike. Zero runtime dependencies.
Published as native ES modules only; Metro and Node 26 load it through `require` as well.

```bash
pnpm add @iveri/tokens
```

```ts
import { color, productColor, radius, toRgbChannels } from '@iveri/tokens';

color.accent; // '#1B2D72'
toRgbChannels(color.accent); // '27 45 114' — the form a CSS custom property needs
productColor.gold; // '#F6C76D'
radius.card; // 12
```

## Why it exists

Every panel used to declare the palette in its own `index.css`, and the six copies had already
drifted into four variants. `@iveri/react-kit@0.6.0` reduced them to one — **for the web**. Both
Expo apps kept a hand-maintained `theme.ts`, because the kit is a React **DOM** package whose
stylesheet imports webfonts: depending on it from React Native pulls a `react-dom` peer and a CSS
file Metro has no use for.

So the fleet went from six copies to three, and the three could only be kept in step by a spec in
each repository that said, in its own comment, **that it could not see drift against the others**.

## What is in it, and what is not

| Export                                         | For                                                                                |
| ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| `color`                                        | The semantic palette every surface draws from                                      |
| `productColor`                                 | The navy hero and the gold that goes on it — a **product** voice, not panel chrome |
| `radius`, `duration`, `easing`, `easingPoints` | The non-colour scales both platforms share                                         |
| `toRgbChannels`                                | `#1B2D72` → `27 45 114`                                                            |

**Hex is canonical and everything else is derived.** The web needs channel triplets so a custom
property can take an alpha (`rgb(var(--color-accent) / 0.16)`); React Native needs a plain colour
string. A package shipping triplets would make the mobile apps parse them; one shipping CSS would
be unusable from React Native at all.

**Not here:** typefaces, shadows and the type scale. A shadow is `box-shadow` on the web and
`shadowOffset`/`elevation` on React Native — the same intent expressed twice, with nothing shared
to extract — and a font stack is a list of family names on one platform and a chosen single face
on the other. Those live in `@iveri/react-kit` and in each app's `typography.ts`, where they are
honest.

**`productColor` is a separate export on purpose.** An admin console does not open on a navy card
with a gold rule, and should not start by accident.

## The two deliberate collapses

- **`productColor.hero` holds the same value as `color.accentHover`.** The two product web apps
  had been writing `#17285d` inline — fourteen occurrences between them, a navy three parts in 255
  from the one the palette already had. Keeping the near-miss would have made it a twenty-fifth
  colour nobody chose.
- **`positive` / `caution` / `critical`, not `success` / `warning` / `danger`.** The design
  standard and six web panels already speak the first set, so the two mobile apps' local names
  become aliases rather than the other way round.

## Changing a value

The radii and the motion scale are a **copy** of `design-system/tokens.json`, which is outside any
package and is not published — so a change belongs in both places, deliberately. `color.spec.ts`
pins them, which is what makes the next invented number fail a test rather than ship.
