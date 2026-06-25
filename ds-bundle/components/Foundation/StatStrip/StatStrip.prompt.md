# StatStrip

Horizontal strip of large stat numbers below the home screen header. 2–4 equal columns.

## Usage

```tsx
<StatStrip stats={[
  { value: 12, label: 'Workouts' },
  { value: '🔥 5', label: 'Streak' },
  { value: '4h 20m', label: 'Total time' },
]} />
```

## Rules
- Place immediately after `ScreenHeader` on the Home screen.
- 2–4 stats only; more than 4 breaks the equal-column layout.
- `value` can include emoji (e.g. `'🔥 5'`).
- `label` is uppercase micro-text — keep under 12 chars.
