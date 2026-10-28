/**
 * The Iveri palette, as hex.
 *
 * **Hex is the canonical form and the other shapes are derived from it.** The web needs channel
 * triplets so a CSS custom property can be used with an alpha (`rgb(var(--color-accent) / 0.1)`),
 * and React Native needs a plain colour string; a package that shipped triplets would make the
 * mobile apps parse them, and one that shipped only CSS would be unusable from React Native at
 * all. `toRgbChannels` is the one conversion, so there is one place to be wrong.
 *
 * **Why this package exists.** Every panel used to declare the palette in its own `index.css`,
 * and `@iveri/react-kit@0.6.0` reduced six copies to one — for the web. Both Expo apps still kept
 * a hand-maintained `theme.ts`, because the kit is a React **DOM** package whose stylesheet
 * imports webfonts: depending on it from React Native pulls a `react-dom` peer and a CSS file
 * Metro has no use for. So the fleet went from six copies to three, and the three could only be
 * kept in step by a spec in each repo that said, in its own comment, that it could not see drift
 * against the others.
 */

/** A `#rrggbb` string. Lowercase is not required; `toRgbChannels` accepts either. */
export type HexColor = `#${string}`;

/**
 * The semantic palette every Iveri surface draws from.
 *
 * The names are the design standard's, which is why the two mobile apps' local `success` /
 * `warning` / `danger` become aliases rather than the other way round: `design.md` and six web
 * panels already speak `positive` / `caution` / `critical`, and a token package that renamed
 * them would make the standard and the package disagree on the day it shipped.
 */
export const color = {
    /* ---- Neutrals ---------------------------------------------------------------------
     * Cool and very slightly blue-shifted, and deliberately **not** Tailwind's `slate`: that
     * ramp is the most recognisable palette on the web, and a product wearing it reads as
     * generated before a single word is read. */
    canvas: '#F7F8FB',
    surface: '#FFFFFF',
    raised: '#F1F3F8',
    /** A well *below* the surface — a table header, a grouped field, code. */
    sunken: '#EDEFF5',
    line: '#E4E7EF',
    /** For a divider that has to be seen rather than felt, and an input border on hover. */
    lineStrong: '#CFD4E2',

    /* ---- Text -------------------------------------------------------------------------
     * Four genuine levels. `faint` carried `muted`'s value in all six panels until 0.6.0, so
     * the hierarchy the standard describes was two levels wearing three names. */
    ink: '#111729',
    inkSoft: '#3A4257',
    muted: '#5C6579',
    faint: '#8A92A6',

    /* ---- Brand ------------------------------------------------------------------------ */
    accent: '#1B2D72',
    accentHover: '#14235C',
    accentInk: '#FFFFFF',
    /** The selected-row and hover wash. Navy at 10% alpha goes grey; a mixed tint stays blue. */
    accentSoft: '#EEF1FA',
    accentLine: '#C7CFE8',
    /** A lighter navy for links: the brand navy at body size reads as near-black. */
    link: '#2A46A8',

    /* ---- Status -----------------------------------------------------------------------
     * Each deepened enough to carry 14px text on its own subtle background, and `info` is a
     * real blue rather than a second copy of the accent — which is what made an info badge and
     * an accent badge the same badge. */
    positive: '#157A4B',
    positiveSoft: '#E3F5EA',
    caution: '#9A6412',
    cautionSoft: '#FBF1DC',
    critical: '#BE2C3C',
    criticalSoft: '#FBE9EB',
    info: '#1F6FA8',
    infoSoft: '#E5F1FA',
} as const satisfies Record<string, HexColor>;

/**
 * The louder half of the system: the navy hero panel and the warm accent that goes on it.
 *
 * **These are a product voice, not panel chrome.** Taxi, Delivery and the shop open on a navy
 * card with a gold rule; an admin console does not, and should not start. They are a separate
 * export so a panel cannot reach for them by accident, and so the next product app has them.
 *
 * ⚠ **`hero` deliberately holds the same value as `color.accentHover`.** The two product web
 * apps had been writing `#17285d` inline — eight occurrences in one, six in the other, a navy
 * three parts in 255 away from the one the palette already had. Keeping the near-miss would have
 * made it a twenty-fifth colour nobody chose; collapsing it onto the deep navy that already
 * existed is the honest reading, and the difference is not visible.
 */
export const productColor = {
    /** The deep navy a hero card is painted in. */
    hero: '#14235C',
    /** Text and rules on `hero`. */
    heroInk: '#FFFFFF',
    /** An error on a hero card, where `critical` would be unreadable. */
    heroCritical: '#FFD2DA',

    /** Iveri's warm accent. Used sparingly, and never to carry status. */
    gold: '#F6C76D',
    goldHover: '#FFDA91',
    /** The rule beside a page heading, and a route marker's ring. */
    goldLine: '#E3AD50',
    goldSoft: '#FFF2D6',
    /** Text on `gold` and on `goldSoft`. */
    goldInk: '#8D5C16',
} as const satisfies Record<string, HexColor>;

export type ColorName = keyof typeof color;
export type ProductColorName = keyof typeof productColor;

/**
 * `#1B2D72` → `27 45 114`, the form a CSS custom property needs.
 *
 * Space-separated rather than comma-separated, because that is the syntax
 * `rgb(var(--color-accent) / 0.16)` requires — a comma-separated triplet silently fails to parse
 * there, and the browser drops the declaration, leaving the inherited colour. Which usually looks
 * close enough to be deliberate.
 */
export function toRgbChannels(hex: HexColor): string {
    const value = hex.replace('#', '');

    if (!/^[0-9a-f]{6}$/i.test(value)) {
        throw new Error(`Not a six-digit hex colour: ${hex}`);
    }

    const channels = [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)];

    return channels.map((channel) => Number.parseInt(channel, 16)).join(' ');
}
