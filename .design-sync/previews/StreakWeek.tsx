import React from 'react';
import { StreakWeek } from 'fitness-pwa-ds';

const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  padding: 16,
  borderRadius: 14,
};

export const MidWeek = () => (
  <div style={surface}>
    <StreakWeek
      days={[
        { label: 'M', state: 'done' },
        { label: 'T', state: 'done' },
        { label: 'W', state: 'today' },
        { label: 'T', state: 'empty' },
        { label: 'F', state: 'empty' },
        { label: 'S', state: 'empty' },
        { label: 'S', state: 'empty' },
      ]}
    />
  </div>
);

export const PerfectWeek = () => (
  <div style={surface}>
    <StreakWeek days={['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(label => ({ label, state: 'done' as const }))} />
  </div>
);

export const FreshWeek = () => (
  <div style={surface}>
    <StreakWeek
      days={[
        { label: 'M', state: 'today' },
        { label: 'T', state: 'empty' },
        { label: 'W', state: 'empty' },
        { label: 'T', state: 'empty' },
        { label: 'F', state: 'empty' },
        { label: 'S', state: 'empty' },
        { label: 'S', state: 'empty' },
      ]}
    />
  </div>
);
