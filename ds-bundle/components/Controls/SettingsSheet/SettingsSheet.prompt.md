# SettingsSheet / SettingsRow / SettingsSection

iOS-style bottom sheet with labelled sections and rows. Each row has a label and a right-aligned control (IosToggle, SegmentedControl, or tap action).

## Usage

```tsx
<SettingsSheet open={settingsOpen} title="Settings" onClose={() => setSettingsOpen(false)}>
  <SettingsSection label="Workout">
    <SettingsRow label="Weight Unit">
      <SegmentedControl options={['kg','lbs']} value={unit} onChange={setUnit} />
    </SettingsRow>
    <SettingsRow label="Rest Timer">
      <IosToggle checked={restEnabled} onChange={setRestEnabled} />
    </SettingsRow>
    <SettingsRow label="Default Rest" onClick={() => openPicker('rest')}>
      <span style={{color:'var(--text-muted)',fontSize:'0.88rem'}}>1 min 30 s ›</span>
    </SettingsRow>
  </SettingsSection>
  <SettingsSection label="App">
    <SettingsRow label="Sound Effects">
      <IosToggle checked={sound} onChange={setSound} />
    </SettingsRow>
  </SettingsSection>
</SettingsSheet>
```

## Rules
- `SettingsSheet` is a fixed overlay — place at root level.
- Slide up when `open` is true; backdrop tap fires `onClose`.
- Nest `SettingsSection` → `SettingsRow` children only.
- Each `SettingsRow` puts its `children` right-aligned. Common children: `IosToggle`, `SegmentedControl`, or a value + chevron span for drill-down rows.
