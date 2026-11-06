import { describe, expect, it } from 'vitest';

import { color, productColor, toRgbChannels } from './color.js';
import { duration, easing, radius } from './scale.js';

/**
 * What these pin is the thing three repositories could not check for themselves: each of the
 * fleet's copies of this palette carried a spec, and each said in its own comment that it could
 * not see drift against the others. One copy makes that checkable.
 */
describe('toRgbChannels', () => {
    it('converts to the space-separated form a CSS custom property needs', () => {
        expect(toRgbChannels(color.accent)).toBe('27 45 114');
        expect(toRgbChannels('#FFFFFF')).toBe('255 255 255');
        expect(toRgbChannels('#000000')).toBe('0 0 0');
    });

    it('accepts either case', () => {
        expect(toRgbChannels('#1b2d72')).toBe(toRgbChannels('#1B2D72'));
    });

    it('is space-separated, never comma-separated', () => {
        // `rgb(var(--x) / 0.16)` does not parse a comma-separated triplet, and a browser that
        // cannot parse a declaration drops it — leaving the inherited colour, which usually
        // looks close enough to be deliberate.
        expect(toRgbChannels(color.ink)).not.toContain(',');
    });

    it('refuses anything that is not a six-digit hex colour', () => {
        expect(() => toRgbChannels('#fff')).toThrow();
        expect(() => toRgbChannels('#1b2d7')).toThrow();
        expect(() => toRgbChannels('rebeccapurple' as `#${string}`)).toThrow();
    });
});

describe('color', () => {
    it('is six-digit hex throughout, so every consumer can read it the same way', () => {
        for (const [name, value] of Object.entries({ ...color, ...productColor })) {
            // Jest's `expect` takes no message argument, so the name goes in the assertion.
            expect(`${name}: ${value}`).toMatch(/^[a-zA-Z]+: #[0-9A-F]{6}$/u);
        }
    });

    it('keeps the four text levels four different colours', () => {
        // `faint` held `muted`'s value in all six panels before the foundation work, so the
        // hierarchy the standard describes was two levels wearing three names.
        const levels = [color.ink, color.inkSoft, color.muted, color.faint];

        expect(new Set(levels).size).toBe(levels.length);
    });

    it('keeps info distinct from the accent', () => {
        // They were the same navy in four of the six panels, which made an info badge and an
        // accent badge the same badge: two meanings, one appearance.
        expect(color.info).not.toBe(color.accent);
    });

    it('holds the hero navy the deep accent already was', () => {
        // Deliberate, and the reason is in color.ts: the two product web apps wrote `#17285d`
        // inline fourteen times between them, three parts in 255 from the navy the palette
        // already had. This asserts the collapse rather than leaving it to look like a typo.
        expect(productColor.hero).toBe(color.accentHover);
    });

    it('keeps the product voice out of the semantic palette', () => {
        // A panel importing `color` must not be able to reach a gold hero button by accident.
        expect(Object.keys(color)).not.toContain('gold');
        expect(Object.keys(color)).not.toContain('hero');
    });
});

describe('scale', () => {
    it("holds the design standard's own radii and motion", () => {
        // Copied, because the standard is not published and this package cannot read it. The
        // first version of the kit's preset invented four of these numbers; this is what makes
        // the next invention fail a test rather than ship.
        expect(radius).toEqual({ control: 8, card: 12, panel: 16 });
        expect(duration).toEqual({ fast: 120, normal: 200, slow: 320 });
        expect(easing.standard).toBe('cubic-bezier(0.2, 0, 0, 1)');
    });
});
