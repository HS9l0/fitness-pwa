import React from 'react';
import { StatStrip } from 'fitness-pwa-ds';

const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  borderRadius: 14,
  overflow: 'hidden',
};

export const ThreeStats = () => (
  <div style={surface}>
    <StatStrip
      stats={[
        { value: 12, label: 'Workouts' },
        { value: '5', label: 'Day streak' },
        { value: '8.4t', label: 'Volume' },
      ]}
    />
  </div>
);

export const TwoStats = () => (
  <div style={surface}>
    <StatStrip stats={[{ value: 42, label: 'Sessions' }, { value: '14:32', label: 'Avg time' }]} />
  </div>
);

export const FourStats = () => (
  <div style={surface}>
    <StatStrip
      stats={[
        { value: 4, label: 'This week' },
        { value: 18, label: 'This month' },
        { value: 142, label: 'All time' },
        { value: '5', label: 'Streak' },
      ]}
    />
  </div>
);
