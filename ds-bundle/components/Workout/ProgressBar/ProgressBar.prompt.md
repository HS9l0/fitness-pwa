# ProgressBar

Green fill bar with "current / total" text. Shows set completion progress per exercise.

## Usage

```tsx
// Inside an ExerciseCard body
<ProgressBar current={2} total={4} label="sets" />

// Without label
<ProgressBar current={3} total={5} />
```

## Rules
- Place at the top of an `ExerciseCard` body, above the sets list.
- `current` and `total` are integers.
- Fill colour is `var(--accent-2)` (green) — matches done set rows.
