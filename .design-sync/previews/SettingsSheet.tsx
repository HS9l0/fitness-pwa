import React from 'react';
import { SettingsSheet, SettingsSection, SettingsRow, SegmentedControl, IosToggle } from 'fitness-pwa-ds';

// SettingsSheet is a position:fixed bottom sheet that fills the viewport, so it
// renders as a single full-card story (see cfg.overrides.SettingsSheet).
// `open` must be true or the panel stays translated off-screen.
export const Open = () => (
  <SettingsSheet open title="Settings" onClose={() => {}}>
    <SettingsSection label="Units">
      <SettingsRow label="Weight">
        <SegmentedControl options={['kg', 'lbs']} value="kg" onChange={() => {}} />
      </SettingsRow>
    </SettingsSection>
    <SettingsSection label="Session">
      <SettingsRow label="Rest timer">
        <IosToggle checked onChange={() => {}} label="Rest timer" />
      </SettingsRow>
      <SettingsRow label="Auto-advance sets">
        <IosToggle checked={false} onChange={() => {}} label="Auto-advance sets" />
      </SettingsRow>
    </SettingsSection>
    <SettingsSection label="About">
      <SettingsRow label="Version">
        <span className="settings-info-val">fitplan-v122</span>
      </SettingsRow>
      <SettingsRow label="Total logged">
        <span className="settings-info-val">142 workouts</span>
      </SettingsRow>
    </SettingsSection>
  </SettingsSheet>
);
