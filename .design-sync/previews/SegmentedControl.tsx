import React from 'react';
import { SegmentedControl } from 'fitness-pwa-ds';

const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  padding: 16,
  borderRadius: 14,
};

export const Units = () => (
  <div style={{ ...surface, display: 'flex' }}>
    <SegmentedControl options={['kg', 'lbs']} value="kg" onChange={() => {}} />
  </div>
);

export const SecondSelected = () => (
  <div style={{ ...surface, display: 'flex' }}>
    <SegmentedControl options={['kg', 'lbs']} value="lbs" onChange={() => {}} />
  </div>
);

export const ThreeOptions = () => (
  <div style={{ ...surface, display: 'flex' }}>
    <SegmentedControl options={['Week', 'Month', 'All']} value="Month" onChange={() => {}} />
  </div>
);

export const InSettingsRow = () => (
  <div style={{ ...surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
    <span style={{ fontSize: '0.9rem' }}>Weight unit</span>
    <SegmentedControl options={['kg', 'lbs']} value="kg" onChange={() => {}} />
  </div>
);
