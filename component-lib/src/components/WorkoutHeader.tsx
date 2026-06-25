import React from 'react';

export interface WorkoutHeaderProps {
  title: string;
  subtitle?: string;
  /** Elapsed time string, e.g. "14:32" */
  elapsed?: string;
  onBack?: () => void;
}

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/** Sticky workout session header — title + subtitle on the left, elapsed timer on the right. */
export function WorkoutHeader({ title, subtitle, elapsed, onBack }: WorkoutHeaderProps) {
  return (
    <div className="workout-header">
      <div className="workout-header-left">
        {onBack && (
          <button className="wkt-back-btn" onClick={onBack}>
            <BackIcon /> Back
          </button>
        )}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {elapsed !== undefined && (
        <div className="wkt-timer-wrap">
          <div className="timer">{elapsed}</div>
          <div className="timer-lbl">elapsed</div>
        </div>
      )}
    </div>
  );
}
