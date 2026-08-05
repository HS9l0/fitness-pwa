import React from 'react';
import { ScreenHeader } from 'fitness-pwa-ds';

const surface: React.CSSProperties = {
  background: 'var(--bg, #080d14)',
  borderRadius: 14,
  overflow: 'hidden',
};

export const WithBadge = () => (
  <div style={surface}>
    <ScreenHeader badge="WEEK 3 · DAY 2" title="Push Day" subtitle="Chest, shoulders & triceps" />
  </div>
);

export const NoBadge = () => (
  <div style={surface}>
    <ScreenHeader title="History" subtitle="42 sessions logged" />
  </div>
);

export const TitleOnly = () => (
  <div style={surface}>
    <ScreenHeader title="Settings" />
  </div>
);

export const RestDay = () => (
  <div style={surface}>
    <ScreenHeader badge="WEEK 3 · REST" title="Rest Day" subtitle="Recovery — no session scheduled" />
  </div>
);
