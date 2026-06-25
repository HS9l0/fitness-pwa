# IosToggle

iOS-style toggle switch. Green when on (`var(--accent-2)`), grey when off. Use inside `SettingsSheet` rows.

## Usage

```tsx
// Inside a settings row
<div className="settings-row">
  <span className="settings-row-label">Rest Timer</span>
  <IosToggle checked={restEnabled} onChange={setRestEnabled} label="Rest Timer" />
</div>
```

## Rules
- Always pair with a `settings-row-label` span inside a `settings-row` div.
- The toggle manages its own label via the `label` prop (screen-reader only) — visible label is a sibling element.
- Do not use outside of a `SettingsSheet` context.
