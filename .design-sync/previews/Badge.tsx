import React from 'react';
import { Badge } from 'fitness-pwa-ds';

const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  padding: 16,
  borderRadius: 14,
};

export const Default = () => (
  <div style={surface}>
    <Badge>WEEK 3 · DAY 2</Badge>
  </div>
);

export const Variants = () => (
  <div style={{ ...surface, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-start' }}>
    <Badge>PUSH</Badge>
    <Badge>REST DAY</Badge>
    <Badge>PERSONAL BEST</Badge>
  </div>
);

export const AboveTitle = () => (
  <div style={surface}>
    <Badge>WEEK 3 · DAY 2</Badge>
    <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.4px' }}>Push Day</div>
  </div>
);
