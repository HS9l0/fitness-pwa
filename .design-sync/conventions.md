# FitnessPWA Design System — Conventions

## Wrapping and setup

Wrap every canvas in `FitTheme` — it sets the dark background (`#080d14`) and ensures CSS custom properties resolve:

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

Without `FitTheme` the CSS variables (`var(--bg)`, `var(--accent)`, etc.) resolve to nothing and all components render unstyled.

## Styling idiom

This system uses **CSS custom properties + class names**. No Tailwind, no CSS-in-JS.

Token reference (all resolve inside `FitTheme`):

| Token | Value | Use for |
|---|---|---|
| `var(--bg)` | `#080d14` | Screen background |
| `var(--surface)` | `#0f1825` | Card background |
| `var(--surface-raised)` | `#162030` | Input, sets-list background |
| `var(--border)` | `#1e2d44` | All borders |
| `var(--accent)` | `#3b82f6` | Blue — active, CTA, timer |
| `var(--accent-2)` | `#22c55e` | Green — done, complete |
| `var(--accent-blue)` | `#06b6d4` | Cyan — install prompt |
| `var(--text)` | `#e2eaf6` | Primary text |
| `var(--text-muted)` | `#7a9bb5` | Secondary text |
| `var(--text-dim)` | `#3a5070` | Placeholder, label text |
| `var(--radius)` | `14px` | Card, button radius |
| `var(--radius-sm)` | `8px` | Input, tag radius |

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
