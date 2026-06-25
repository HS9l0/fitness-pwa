# WorkoutHeader

Sticky header for the active workout session. Title + subtitle left, elapsed timer right. Optional back button.

## Usage

```tsx
// Active workout — with timer
<WorkoutHeader title="Push Day" subtitle="Chest, Shoulders & Triceps" elapsed="14:32" onBack={handleBack} />

// Without elapsed (pre-start state)
<WorkoutHeader title="Push Day" subtitle="4 exercises" onBack={handleBack} />
```

## Rules
- Use instead of `ScreenHeader` during an active workout session.
- `elapsed` is a pre-formatted string (MM:SS or H:MM:SS) — format it before passing.
- `onBack` renders a "← Back" link; omit it if there's no back navigation.
- This header is sticky (`position: sticky; top: 0`) — place it as the first child of the scroll container.
