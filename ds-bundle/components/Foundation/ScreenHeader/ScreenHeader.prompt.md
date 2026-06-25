# ScreenHeader

Page header with gradient background. Opens every non-workout screen. Contains optional badge, bold title, and muted subtitle.

## Usage

```tsx
// Full header with badge
<ScreenHeader badge="WEEK 3 · DAY 2" title="Push Day" subtitle="Chest, Shoulders & Triceps" />

// Simple header
<ScreenHeader title="Home" subtitle="Welcome back" />

// No subtitle
<ScreenHeader title="History" />
```

## Rules
- Always the first element inside a screen container.
- `badge` renders as an uppercase pill above the title — use for week/day context.
- `title` is the screen name, bold and large.
- `subtitle` is muted secondary text — keep under 50 chars.
