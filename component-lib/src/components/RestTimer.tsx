import React from 'react';

export interface RestTimerProps {
  /** Remaining seconds */
  seconds: number;
  /** Total duration for the arc (determines how full the ring is) */
  totalSeconds: number;
  onSkip?: () => void;
  onAdd?: (extraSeconds: number) => void;
  /** Extra-time increment for the "+30s" button (default 30) */
  addIncrement?: number;
}

const RADIUS = 35;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Floating rest timer — circular arc countdown with skip and add-time buttons. */
export function RestTimer({
  seconds,
  totalSeconds,
  onSkip,
  onAdd,
  addIncrement = 30,
}: RestTimerProps) {
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins > 0 ? `${mins}:` : ''}${String(secs).padStart(mins > 0 ? 2 : 1, '0')}`;

  return (
    <div className="rest-overlay">
      <div className="rest-card">
        <div className="rest-lbl">REST</div>
        <div className="rest-arc-wrap">
          <svg className="rest-arc-svg" viewBox="0 0 80 80">
            <circle className="rest-arc-bg" cx="40" cy="40" r={RADIUS} />
            <circle
              className="rest-arc-fill"
              cx="40" cy="40" r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 0.95s linear' }}
            />
          </svg>
          <div className="rest-arc-inner">
            <span className="rest-count">{display}</span>
          </div>
        </div>
        <div className="rest-btns">
          {onAdd && (
            <button className="rest-btn-add" onClick={() => onAdd(addIncrement)}>
              +{addIncrement}s
            </button>
          )}
          {onSkip && (
            <button className="rest-btn-skip" onClick={onSkip}>
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
