# ExerciseCard

Collapsible card for one exercise. Header always visible; body (set rows) expands on tap.

## Usage

```tsx
<ExerciseCard number={1} name="Bench Press" muscles="Chest, Triceps" meta="4 × 10" defaultOpen>
  <ProgressBar current={1} total={4} label="sets" />
  <div className="sets-list">
    <SetRow setNumber={1} weight={80} reps={10} done unit="kg" />
    <SetRow setNumber={2} weight={80} unit="kg" onCheck={check} onSkip={skip} />
    <SetRow setNumber={3} unit="kg" onCheck={check} onSkip={skip} />
    <SetRow setNumber={4} unit="kg" onCheck={check} onSkip={skip} />
  </div>
</ExerciseCard>

// Complete state — green circle
<ExerciseCard number={2} name="Cable Flyes" muscles="Chest" meta="3 × 15" complete />
```

## Rules
- Children render inside the collapsible body. Always include a `ProgressBar` + `.sets-list` for strength exercises.
- `meta` shows set×rep spec (strength) or duration (cardio) in `var(--accent)` blue.
- `complete` triggers the green number animation — set when all sets are done.
- Stack multiple `ExerciseCard` components directly; they self-space via `margin-bottom: 10px`.
