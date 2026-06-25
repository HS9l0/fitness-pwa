import React from 'react';

export type StreakDayState = 'done' | 'today' | 'empty';

export interface StreakDay {
  /** Single-letter label: 'M', 'T', 'W', 'T', 'F', 'S', 'S' */
  label: string;
  state: StreakDayState;
}

export interface StreakWeekProps {
  /** Exactly 7 days, Monday → Sunday */
  days: StreakDay[];
}

/** 7-day streak row — filled dot for completed days, outlined for today, dim for empty. */
export function StreakWeek({ days }: StreakWeekProps) {
  return (
    <div className="streak-row">
      {days.map((d, i) => (
        <div key={i} className={['streak-dot', d.state === 'done' ? 'done' : d.state === 'today' ? 'today' : ''].filter(Boolean).join(' ')}>
          <div className="dot">{d.state === 'done' ? '✓' : ''}</div>
          <div className="day-lbl">{d.label}</div>
        </div>
      ))}
    </div>
  );
}
