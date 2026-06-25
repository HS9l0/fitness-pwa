import React from 'react';

export interface ProgressBarProps {
  /** Number of completed items */
  current: number;
  /** Total items */
  total: number;
  /** Optional label suffix, e.g. "sets" → "2 / 4 sets" */
  label?: string;
}

/** Sets progress bar — green fill, shows "current / total" count to the right. */
export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  return (
    <div className="sets-progress">
      <div className="sets-progress-bar">
        <div className="sets-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="sets-progress-txt">
        {current} / {total}{label ? ` ${label}` : ''}
      </div>
    </div>
  );
}
