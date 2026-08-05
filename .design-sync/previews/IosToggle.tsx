import React from 'react';
import { IosToggle } from 'fitness-pwa-ds';

const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  padding: 16,
  borderRadius: 14,
};

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
};

export const On = () => (
  <div style={surface}>
    <div style={row}>
      <span style={{ fontSize: '0.9rem' }}>Rest timer</span>
      <IosToggle checked onChange={() => {}} label="Rest timer" />
    </div>
  </div>
);

export const Off = () => (
  <div style={surface}>
    <div style={row}>
      <span style={{ fontSize: '0.9rem' }}>Test mode</span>
      <IosToggle checked={false} onChange={() => {}} label="Test mode" />
    </div>
  </div>
);

export const InSettingsList = () => (
  <div style={surface}>
    <div style={{ ...row, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
      <span style={{ fontSize: '0.9rem' }}>Auto-advance sets</span>
      <IosToggle checked onChange={() => {}} label="Auto-advance sets" />
    </div>
    <div style={{ ...row, paddingTop: 12 }}>
      <span style={{ fontSize: '0.9rem' }}>Haptic feedback</span>
      <IosToggle checked={false} onChange={() => {}} label="Haptic feedback" />
    </div>
  </div>
);
