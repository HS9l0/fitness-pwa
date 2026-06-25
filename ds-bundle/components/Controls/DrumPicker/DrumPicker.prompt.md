# DrumPicker

iOS-style bottom sheet scroll picker. Snap-scrolls to selection. Blurred backdrop. Used for rest duration, weight, and rep count entry.

## Usage

```tsx
// Rest duration: "2.5 min"
{pickerOpen && (
  <DrumPicker
    title="Rest Duration"
    columns={[
      { items: [1,2,3,4,5], value: 2, label: 'min' },
      { items: ['.0','.5'], value: '.5', narrow: true },
    ]}
    onChange={(col, val) => updateDuration(col, val)}
    onDone={() => setPickerOpen(false)}
    onCancel={() => setPickerOpen(false)}
  />
)}

// Single-column picker
<DrumPicker
  title="Reps"
  columns={[{ items: Array.from({length:30},(_,i)=>i+1), value: 10 }]}
  onChange={(_, val) => setReps(val)}
  onDone={handleDone}
  onCancel={handleCancel}
/>
```

## Rules
- Renders as a fixed overlay — place at root level, not inside scroll containers.
- `narrow: true` on a column sets it to 52px wide — for short values like ".0" / ".5".
- The picker does not close itself — call `onDone` / `onCancel` to hide it.
- Backdrop tap fires `onCancel`.
