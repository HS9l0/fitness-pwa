import React from 'react';
import { Card } from 'fitness-pwa-ds';

const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  padding: 16,
  borderRadius: 14,
};

export const Basic = () => (
  <div style={surface}>
    <Card>
      <div className="section-title">Next up</div>
      <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>Push Day</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
        6 exercises · about 55 min
      </div>
    </Card>
  </div>
);

export const Stacked = () => (
  <div style={surface}>
    <Card>
      <div style={{ fontWeight: 700 }}>Monday — Push</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Chest, shoulders, triceps</div>
    </Card>
    <Card>
      <div style={{ fontWeight: 700 }}>Wednesday — Pull</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Back, biceps</div>
    </Card>
  </div>
);

export const WithAccentValue = () => (
  <div style={surface}>
    <Card>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700 }}>Weekly volume</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 2 }}>vs. last week</div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)' }}>+12%</div>
      </div>
    </Card>
  </div>
);
