/**
 * The non-colour scales both platforms share.
 *
 * ⚠ **These values are `design-system/tokens.json`'s, by its own names**, and this package
 * cannot read that file: the standard lives outside any package and is not published. So this is
 * a copy, and a change belongs in both places deliberately — which is exactly the mistake
 * `@iveri/react-kit`'s first preset made, inventing 10px, 14px, 180ms and 260ms where the
 * standard already said 12px, 16px, 200ms and 320ms.
 */

/** Corner radii, in pixels. The web converts to rem; React Native wants the number. */
export const radius = {
    /** A button, an input, a badge. */
    control: 8,
    /** A card. */
    card: 12,
    /** A panel or a sheet. */
    panel: 16,
} as const;

/** Transition durations, in milliseconds. */
export const duration = {
    /** A small state change — a hover, a focus ring. */
    fast: 120,
    /** The standard transition. */
    normal: 200,
    /** A panel or an overlay, and nothing smaller. */
    slow: 320,
} as const;

/**
 * The standard's easing, verbatim.
 *
 * A decelerating curve, so a thing arrives rather than coasting to a stop. React Native's
 * `Easing.bezier` takes the same four numbers, which is why they are exported as numbers too.
 */
export const easing = {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

/** `easing.standard`'s control points, for a platform that cannot parse the CSS form. */
export const easingPoints = {
    standard: [0.2, 0, 0, 1],
} as const;

export type RadiusName = keyof typeof radius;
export type DurationName = keyof typeof duration;
