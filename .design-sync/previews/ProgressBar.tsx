import React from 'react';
import { ProgressBar } from 'fitness-pwa-ds';

// ProgressBar is a thin strip; it only reads correctly with the surrounding
// card context it has in the app, so each story gives it one.
const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  padding: 16,
  borderRadius: 14,
};

const panel: React.CSSProperties = {
  background: 'var(--surface, #0f1115)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius, 20px)',
  padding: '14px 16px',
};

export const PartlyDone = () => (
  <div style={surface}>
    <div style={panel}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Bench Press</div>
      <ProgressBar current={2} total={4} label="sets" />
    </div>
  </div>
);

export const NotStarted = () => (
  <div style={surface}>
    <div style={panel}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Overhead Press</div>
      <ProgressBar current={0} total={3} label="sets" />
    </div>
  </div>
);

export const Complete = () => (
  <div style={surface}>
    <div style={panel}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Cable Fly</div>
      <ProgressBar current={3} total={3} label="sets" />
    </div>
  </div>
);

export const NoLabel = () => (
  <div style={surface}>
    <div style={panel}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Session progress</div>
      <ProgressBar current={5} total={8} />
    </div>
  </div>
);
