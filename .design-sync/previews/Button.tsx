import React from 'react';
import { Button } from 'fitness-pwa-ds';

// The card harness paints its page white; this DS is dark-only, so every
// story lays itself on the app background the way a real screen does.
const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  padding: 16,
  borderRadius: 14,
};

export const Primary = () => (
  <div style={surface}>
    <Button variant="primary">Begin Push Day</Button>
  </div>
);

export const Ghost = () => (
  <div style={{ ...surface, display: 'flex' }}>
    <Button variant="ghost">Add exercise</Button>
  </div>
);

// How the two variants actually pair in a screen footer: ghost for the
// escape hatch, primary for the commit action.
export const PairedActions = () => (
  <div style={{ ...surface, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <Button variant="primary">Finish workout</Button>
    <Button variant="ghost">Discard session</Button>
  </div>
);
