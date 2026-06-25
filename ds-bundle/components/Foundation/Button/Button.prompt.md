# Button

Two variants: `primary` (filled blue, full-width) and `ghost` (bordered, inline).

## Usage

```tsx
// Primary CTA — full width by default
<Button variant="primary" onClick={handleBegin}>▶  Begin Workout</Button>

// Pulsing variant for the main screen CTA only
<Button variant="primary" pulsing onClick={handleBegin}>▶  Begin Workout</Button>

// Ghost — inline, wraps content
<Button variant="ghost" onClick={handleAdd}>+ Add Exercise</Button>
<Button variant="ghost" onClick={handleBack}>← Back</Button>
```

## Rules
- `primary` fills its container width — wrap in a container to constrain.
- Use `pulsing` only for a single primary CTA per screen; it draws strong attention.
- `ghost` is for secondary actions alongside a primary button, or standalone utility actions.
- Do not stack two `primary` buttons without a `ghost` in between.
