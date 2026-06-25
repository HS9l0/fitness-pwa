# SegmentedControl

Two-segment pill switcher. Active segment has a solid background. Used for unit selection (kg/lbs) and binary settings.

## Usage

```tsx
// Unit switcher inside a settings row
<div className="settings-row">
  <span className="settings-row-label">Weight Unit</span>
  <SegmentedControl options={['kg', 'lbs']} value={unit} onChange={setUnit} />
</div>

// Generic binary choice
<SegmentedControl options={['Light', 'Dark']} value={theme} onChange={setTheme} />
```

## Rules
- Designed for exactly 2 options. 3+ options are possible but not tested.
- Use inside `SettingsSheet` rows alongside `settings-row-label`.
- `value` must exactly match one of the `options` strings.
