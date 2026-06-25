# FitnessPWA Design System

Dark, mobile-first fitness app component library. 15 components across 5 groups.

## Setup

Wrap every canvas in `FitTheme`. Without it, CSS tokens don't resolve and components render unstyled.

```tsx
import { FitTheme, ScreenHeader, StatStrip } from 'fitness-pwa-ds';

<FitTheme>
  <ScreenHeader badge="WEEK 3 · DAY 2" title="Push Day" subtitle="Chest & Triceps" />
  <StatStrip stats={[{ value: 12, label: 'Workouts' }, { value: '🔥 5', label: 'Streak' }]} />
</FitTheme>
```

## Component Groups

### Foundation
- **Button** — primary (filled blue, full-width) and ghost (bordered) variants
- **Card** — dark surface container
- **Badge** — accent-blue pill label
- **ScreenHeader** — gradient page header with optional badge + subtitle
- **StatStrip** — horizontal stat numbers strip (2–4 columns)

### Workout
- **ExerciseCard** — collapsible card with number, name, muscles, meta spec
- **SetRow** — weight × reps row with done/skipped states; wrap in `.sets-list`
- **ProgressBar** — green fill bar with count text
- **WorkoutHeader** — sticky session header with elapsed timer
- **RestTimer** — floating arc countdown overlay

### Home
- **StreakWeek** — 7-day streak dots (done / today / empty)

### Navigation
- **BottomNav** — mobile tab bar (hidden ≥768px)

### Controls
- **IosToggle** — green/grey checkbox toggle
- **SegmentedControl** — 2-option pill switcher (kg/lbs, theme, etc.)
- **DrumPicker** — iOS scroll picker bottom sheet
- **SettingsSheet** — slide-up settings panel with SettingsSection + SettingsRow

## Tokens

All CSS custom properties are set on `:root` via `styles.css`. Key values:

| Token | Colour |
|---|---|
| `var(--bg)` | `#080d14` — screen background |
| `var(--surface)` | `#0f1825` — card background |
| `var(--accent)` | `#3b82f6` — blue, CTA, active state |
| `var(--accent-2)` | `#22c55e` — green, done/complete state |
| `var(--text)` | `#e2eaf6` — primary text |
| `var(--text-muted)` | `#7a9bb5` — secondary text |
| `var(--text-dim)` | `#3a5070` — labels, placeholders |
| `var(--border)` | `#1e2d44` — all borders |

For layout glue, use inline styles with these tokens.
