import React from 'react';
import { SettingsSection, SettingsRow, IosToggle, SegmentedControl } from 'fitness-pwa-ds';

// SettingsSection renders a label plus its rows as a fragment — it needs the
// sheet's body container around it to sit correctly.
const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  padding: 16,
  borderRadius: 14,
};

const panel = (children: React.ReactNode) => (
  <div style={surface}>
    <div style={{ background: 'var(--surface, #0f1115)', border: '1px solid var(--border)', borderRadius: 18 }}>
      <div className="settings-body">{children}</div>
    </div>
  </div>
);

export const SingleSection = () =>
  panel(
    <SettingsSection label="Units">
      <SettingsRow label="Weight">
        <SegmentedControl options={['kg', 'lbs']} value="kg" onChange={() => {}} />
      </SettingsRow>
    </SettingsSection>
  );

export const TwoSections = () =>
  panel(
    <>
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
      </SettingsSection>
    </>
  );
