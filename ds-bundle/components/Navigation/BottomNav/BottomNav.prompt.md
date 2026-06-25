# BottomNav

Mobile bottom navigation bar. Icon + label tabs with active blue highlight pill. Hidden on desktop (≥768px) where a sidebar is shown instead.

## Usage

```tsx
<BottomNav
  items={[
    { id: 'home', label: 'Home', icon: <HomeIcon />, active: true },
    { id: 'workout', label: 'Workout', icon: <DumbbellIcon /> },
    { id: 'history', label: 'History', icon: <CalendarIcon /> },
  ]}
  onSelect={(id) => navigate(id)}
/>
```

## Rules
- Place at the bottom of the app shell, outside all screens.
- Pass exactly 2–4 items; more than 4 breaks the equal-flex layout.
- Only one item should have `active: true` at a time.
- Icons should be 20×20px SVGs with `currentColor` stroke.
- On desktop (≥768px) this component should be hidden — use a sidebar instead.
