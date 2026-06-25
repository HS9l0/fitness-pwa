# SetRow

One set row: weight + reps inputs, skip button, check button. Three states: default, done (green), skipped (dim).

## Usage

```tsx
// Wrap multiple SetRows in a .sets-list div
<div className="sets-list">
  <SetRow setNumber={1} weight={80} reps={10} done unit="kg" />
  <SetRow setNumber={2} weight={80} unit="kg"
    onCheck={handleCheck} onSkip={handleSkip}
    onWeightChange={setWeight} onRepsChange={setReps} />
  <SetRow setNumber={3} skipped unit="kg" />
</div>
```

## Rules
- Always wrap in `<div className="sets-list">` for the grouped-list border style.
- `done` and `skipped` are mutually exclusive — don't set both.
- Pass `lastHint` to show a previous-session reference above the inputs.
- `unit` defaults to `'kg'`; matches the app-wide unit preference.
