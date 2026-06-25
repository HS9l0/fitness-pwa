# Card

Dark surface container with border and shadow. The base building block for content sections.

## Usage

```tsx
<Card>
  <div>Next Workout</div>
  <p>Push Day · Chest &amp; Triceps</p>
</Card>

// Stacked cards auto-space via CSS (.card + .card selector)
<Card>First card</Card>
<Card>Second card — 8px gap applied automatically</Card>
```

## Rules
- Use for grouping related content on a screen.
- Pass `className` to add section-specific styles (e.g. `"install-card"` for the install prompt).
- Do not nest Cards inside Cards.
