import React from 'react';
import { RestTimer } from 'fitness-pwa-ds';

// RestTimer is a position:fixed overlay pinned above the bottom nav, so it
// renders as a single full-card story (see cfg.overrides.RestTimer).
//
// Unlike the other two overlays in this DS, .rest-overlay has no height of its
// own — it is `bottom`-anchored and shrink-wraps its card. That leaves the
// preview root measuring 0px and the capture cropping to nothing, so the story
// supplies a full-height stage for it to sit on.
const stage: React.CSSProperties = {
  position: 'relative',
  height: '100dvh',
  background: 'var(--bg, #000000)',
};

export const Counting = () => (
  <div style={stage}>
    <RestTimer seconds={45} totalSeconds={90} onSkip={() => {}} onAdd={() => {}} />
  </div>
);
