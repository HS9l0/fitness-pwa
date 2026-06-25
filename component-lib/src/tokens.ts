// Design tokens — mirrors the :root CSS custom properties in styles.css.
// Use these in inline styles when a CSS class alone isn't enough.
export const tokens = {
  bg:           'var(--bg)',
  surface:      'var(--surface)',
  surfaceRaised:'var(--surface-raised)',
  border:       'var(--border)',
  accent:       'var(--accent)',
  accent2:      'var(--accent-2)',
  accentBlue:   'var(--accent-blue)',
  text:         'var(--text)',
  textMuted:    'var(--text-muted)',
  textDim:      'var(--text-dim)',
  radius:       'var(--radius)',
  radiusSm:     'var(--radius-sm)',
} as const;
