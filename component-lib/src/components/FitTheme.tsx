import React from 'react';

export interface FitThemeProps {
  children: React.ReactNode;
}

/**
 * FitTheme — root wrapper that sets the dark background and injects :root CSS variables.
 * Wrap every design canvas in this component or the tokens and colours won't resolve.
 *
 * Usage:
 * ```tsx
 * <FitTheme>
 *   <ScreenHeader title="Home" badge="WEEK 3 · DAY 2" />
 * </FitTheme>
 * ```
 */
export function FitTheme({ children }: FitThemeProps) {
  return (
    <div
      style={{
        fontFamily: "system-ui, 'Segoe UI', sans-serif",
        background: 'var(--bg, #080d14)',
        color: 'var(--text, #e2eaf6)',
        minHeight: '100%',
      }}
    >
      {children}
    </div>
  );
}
