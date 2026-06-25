# RestTimer

Floating rest timer overlay. Circular arc countdown, +30s button, skip button. Animates in from below.

## Usage

```tsx
// Shown after a set is checked — floats above the bottom nav
{restActive && (
  <RestTimer
    seconds={restSeconds}
    totalSeconds={90}
    onSkip={() => setRestActive(false)}
    onAdd={(s) => setRestSeconds(r => r + s)}
  />
)}
```

## Rules
- Renders as a fixed overlay (`position: fixed`) — place it at the root of the screen, not inside a scrollable container.
- `seconds / totalSeconds` ratio determines how full the arc is (1.0 = full circle, 0 = empty).
- `addIncrement` defaults to 30; pass a different value for custom rest intervals.
- The timer does NOT run itself — manage the countdown in parent state and pass updated `seconds` each tick.
