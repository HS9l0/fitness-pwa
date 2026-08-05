import React from 'react';
import { DrumPicker } from 'fitness-pwa-ds';

// DrumPicker is a position:fixed bottom sheet filling the viewport, so it
// renders as a single full-card story (see cfg.overrides.DrumPicker).
export const Weight = () => (
  <DrumPicker
    title="Weight"
    columns={[
      { items: [60, 65, 70, 75, 80, 85, 90, 95, 100], value: 80, label: 'kg' },
      { items: ['.0', '.5'], value: '.5', label: '', narrow: true },
    ]}
    onChange={() => {}}
    onDone={() => {}}
    onCancel={() => {}}
  />
);
