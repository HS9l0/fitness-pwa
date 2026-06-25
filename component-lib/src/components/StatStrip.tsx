import React from 'react';

export interface Stat {
  value: string | number;
  label: string;
}

export interface StatStripProps {
  /** 2–4 stats displayed as equal-width columns */
  stats: Stat[];
}

/** Horizontal strip of large stat numbers — sits below the screen header on the Home screen. */
export function StatStrip({ stats }: StatStripProps) {
  return (
    <div className="home-stats">
      {stats.map((s, i) => (
        <div key={i} className="home-stat">
          <div className="home-stat-num">{s.value}</div>
          <div className="home-stat-lbl">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
