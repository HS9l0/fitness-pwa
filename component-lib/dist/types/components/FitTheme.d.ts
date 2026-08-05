import React from 'react';
export interface FitThemeProps {
    children: React.ReactNode;
}
/**
 * FitTheme — root wrapper that establishes the dark canvas and base text colour.
 *
 * The design tokens themselves live in `:root` in the shipped `styles.css`, so
 * `var(--*)` resolves with or without this wrapper. What FitTheme supplies is
 * the surface: wrap every design canvas in it, or components render against
 * whatever background the host page has.
 *
 * It is `minHeight: 100%`, so it needs a parent with real height to fill —
 * inside an auto-height container it collapses to its content.
 *
 * Usage:
 * ```tsx
 * <FitTheme>
 *   <ScreenHeader title="Home" badge="WEEK 3 · DAY 2" />
 * </FitTheme>
 * ```
 */
export declare function FitTheme({ children }: FitThemeProps): React.JSX.Element;
