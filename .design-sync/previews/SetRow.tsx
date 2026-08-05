import React from 'react';
import { SetRow } from 'fitness-pwa-ds';

// SetRow is always rendered inside a .sets-list container in the app — the
// list supplies the row separators and inset background.
const surface: React.CSSProperties = {
  background: 'var(--bg, #080d14)',
  padding: 16,
  borderRadius: 14,
};

export const Pending = () => (
  <div style={surface}>
    <div className="sets-list">
      <SetRow setNumber={1} weight={80} reps={10} unit="kg" />
    </div>
  </div>
);

export const WithLastHint = () => (
  <div style={surface}>
    <div className="sets-list">
      <SetRow setNumber={2} weight={82.5} reps={8} unit="kg" lastHint="Last time: 80 kg × 10" />
    </div>
  </div>
);

export const Done = () => (
  <div style={surface}>
    <div className="sets-list">
      <SetRow setNumber={1} weight={80} reps={10} unit="kg" done />
    </div>
  </div>
);

// No `skipped` story: since v68 a skipped row stays visually neutral — only
// the check button tints — so it is pixel-identical to Pending.

export const Empty = () => (
  <div style={surface}>
    <div className="sets-list">
      <SetRow setNumber={4} unit="kg" />
    </div>
  </div>
);

export const Pounds = () => (
  <div style={surface}>
    <div className="sets-list">
      <SetRow setNumber={1} weight={185} reps={5} unit="lbs" />
    </div>
  </div>
);
