import React from 'react';
import { SettingsRow, SegmentedControl, IosToggle } from 'fitness-pwa-ds';

// SettingsRow is a leaf of SettingsSheet — it only reads correctly inside the
// sheet's panel/body, so each story supplies that container.
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

export const WithValue = () =>
  panel(
    <SettingsRow label="Version">
      <span className="settings-info-val">fitplan-v122</span>
    </SettingsRow>
  );

export const WithToggle = () =>
  panel(
    <SettingsRow label="Rest timer">
      <IosToggle checked onChange={() => {}} label="Rest timer" />
    </SettingsRow>
  );

export const WithSegmentedControl = () =>
  panel(
    <SettingsRow label="Weight unit">
      <SegmentedControl options={['kg', 'lbs']} value="kg" onChange={() => {}} />
    </SettingsRow>
  );

export const Stacked = () =>
  panel(
    <>
      <SettingsRow label="Rest timer">
        <IosToggle checked onChange={() => {}} label="Rest timer" />
      </SettingsRow>
      <SettingsRow label="Haptic feedback">
        <IosToggle checked={false} onChange={() => {}} label="Haptic feedback" />
      </SettingsRow>
      <SettingsRow label="Total logged">
        <span className="settings-info-val">142 workouts</span>
      </SettingsRow>
    </>
  );
