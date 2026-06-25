# StreakWeek

7-day streak row. Filled blue dot = done, outlined blue = today, dim = empty.

## Usage

```tsx
<StreakWeek days={[
  { label: 'M', state: 'done' },
  { label: 'T', state: 'done' },
  { label: 'W', state: 'done' },
  { label: 'T', state: 'today' },
  { label: 'F', state: 'empty' },
  { label: 'S', state: 'empty' },
  { label: 'S', state: 'empty' },
]} />
```

## Rules
- Always pass exactly 7 days.
- Only one day should have `state: 'today'`.
- Wrap in a `Card` or a `.section` div for padding.
