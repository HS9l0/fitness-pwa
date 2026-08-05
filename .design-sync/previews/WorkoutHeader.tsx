import React from 'react';
import { WorkoutHeader } from 'fitness-pwa-ds';

const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  borderRadius: 14,
  overflow: 'hidden',
};

export const InSession = () => (
  <div style={surface}>
    <WorkoutHeader title="Push Day" subtitle="6 exercises" elapsed="14:32" onBack={() => {}} />
  </div>
);

export const NoTimer = () => (
  <div style={surface}>
    <WorkoutHeader title="Pull Day" subtitle="5 exercises" onBack={() => {}} />
  </div>
);

export const NoBackButton = () => (
  <div style={surface}>
    <WorkoutHeader title="Leg Day" subtitle="7 exercises" elapsed="02:11" />
  </div>
);

export const LongSession = () => (
  <div style={surface}>
    <WorkoutHeader title="Full Body" subtitle="9 exercises · superset" elapsed="1:07:45" onBack={() => {}} />
  </div>
);
