# FitnessPWA Design System — Conventions

## Wrapping and setup

Wrap every canvas in `FitTheme` — it sets the dark background (`var(--bg)`, `#000000`) and the base text colour:

```tsx
import { FitTheme } from 'fitness-pwa-ds';

export default function App() {
  return (
    <FitTheme>
      <ScreenHeader badge="WEEK 3 · DAY 2" title="Push Day" subtitle="Chest & Triceps" />
      <StatStrip stats={[{ value: 12, label: 'Workouts' }, { value: '🔥 5', label: 'Streak' }]} />
    </FitTheme>
  );
}
```

`FitTheme` only paints the surface it is given — it is `minHeight: 100%`, so give it a parent with real height (or your own full-bleed wrapper) or the dark background will collapse to content height and leave the page white behind it.

The tokens themselves come from `styles.css` (`:root`), which ships with the bundle — so `var(--accent)` resolves with or without `FitTheme`. What you lose without the wrapper is the dark canvas and the default text colour, which makes every component look like it is floating on white.

## Styling idiom

This system uses **CSS custom properties + class names**. No Tailwind, no CSS-in-JS.

Token reference — every value below is read from `:root` in `styles.css`.

**The accent is lime, not blue.** `--accent` (`#a8e635`) is the brand colour: CTAs, active states, completion. `--accent2` (`#72b4ea`) is a cool blue used as the *secondary* accent for metadata and specs. Getting these two the wrong way round is the single easiest way to produce an off-brand design.

| Token | Value | Use for |
|---|---|---|
| `var(--bg)` | `#000000` | Screen background — true black |
| `var(--surface)` | `#0f1115` | Card background |
| `var(--surface2)` / `var(--surface-raised)` | `#181b21` | Input, sets-list, raised fill |
| `var(--border)` | `rgba(255,255,255,.10)` | All borders |
| `var(--accent)` | `#a8e635` | **Lime** — primary CTA, active, done |
| `var(--accentSoft)` | `rgba(168,230,53,.16)` | Tinted lime fill behind accents |
| `var(--onAccent)` | `#16230b` | Text/icon colour on a lime fill |
| `var(--accent2)` / `var(--accent-2)` / `var(--accent-blue)` | `#72b4ea` | Blue — secondary accent, set specs |
| `var(--accent3)` | `#a78bfa` | Violet — third accent |
| `var(--grad)` | `linear-gradient(135deg,#6a9e1c,#2f6db0)` | Header / hero gradient |
| `var(--text)` | `#f2f5fa` | Primary text |
| `var(--muted)` / `var(--text-muted)` | `rgba(232,238,247,.62)` | Secondary text |
| `var(--dim)` / `var(--text-dim)` | `rgba(232,238,247,.38)` | Placeholder, label text |
| `var(--field)` | `rgba(255,255,255,.05)` | Input field fill |
| `var(--graySoft)` | `rgba(255,255,255,.09)` | Neutral button fill |
| `var(--okSoft)` / `var(--okSoft2)` | `rgba(114,180,234,.12/.22)` | Blue tinted states |
| `var(--seg)` | `#22262e` | Segmented-control track |
| `var(--shadow)` | `0 1px 6px rgba(0,0,0,.6)` | Card shadow |
| `var(--radius)` | `20px` | Card, button radius |
| `var(--radius-sm)` | `10px` | Input, tag radius |
| `var(--nav-h)` | `54px` | Bottom nav height |
| `var(--safe-top)` / `var(--safe-bottom)` | `env(safe-area-inset-*)` | iOS safe-area insets |

For layout glue between components, use inline styles with these tokens — e.g. `style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}`.

Utility class names for structural layout:
- `.section` — `padding: 14px 16px` (screen content sections)
- `.section-title` — uppercase 0.64rem muted label above a group
- `.card` — surface card with border and shadow
- `.screen-header` — gradient page header (use `ScreenHeader` component instead)

## Where the truth lives

Read `styles.css` for all token values and class names before styling layout. Read each component's `.prompt.md` for usage rules. The token table above is authoritative for inline styles.

## Idiomatic build snippet

```tsx
// Workout screen with header, exercise card, and active set rows
<FitTheme>
  <WorkoutHeader title="Push Day" subtitle="4 exercises" elapsed="14:32" onBack={goBack} />
  <div className="section">
    <ExerciseCard number={1} name="Bench Press" muscles="Chest, Triceps" meta="4 × 10" defaultOpen>
      <ProgressBar current={1} total={4} label="sets" />
      <div className="sets-list">
        <SetRow setNumber={1} weight={80} reps={10} done unit="kg" />
        <SetRow setNumber={2} weight={80} unit="kg" onCheck={check} onSkip={skip} />
      </div>
    </ExerciseCard>
  </div>
  {restActive && <RestTimer seconds={45} totalSeconds={90} onSkip={stopRest} onAdd={addTime} />}
</FitTheme>
```
