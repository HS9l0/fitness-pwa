import React from 'react';

export interface SetRowProps {
  setNumber: number;
  reps?: number | string;
  weight?: number | string;
  unit?: 'kg' | 'lbs';
  done?: boolean;
  skipped?: boolean;
  onCheck?: () => void;
  onSkip?: () => void;
  onRepsChange?: (value: string) => void;
  onWeightChange?: (value: string) => void;
  /** Previous session hint shown above the inputs */
  lastHint?: string;
}

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** One set row — weight + reps inputs with skip and check buttons. */
export function SetRow({
  setNumber,
  reps = '',
  weight = '',
  unit = 'kg',
  done = false,
  skipped = false,
  onCheck,
  onSkip,
  onRepsChange,
  onWeightChange,
  lastHint,
}: SetRowProps) {
  const rowClass = ['set-row', done ? 'done' : '', skipped ? 'skipped' : ''].filter(Boolean).join(' ');

  return (
    <div className={rowClass}>
      {lastHint && <div className="set-last-hint">{lastHint}</div>}
      <div className="set-row-top">
        <div className="set-num">{setNumber}</div>
        <div className="set-fields">
          <div className="set-field">
            <div
              className={['set-val', weight === '' ? 'empty' : ''].filter(Boolean).join(' ')}
              onClick={() => !done && !skipped && onWeightChange?.('')}
            >
              {weight !== '' ? weight : unit}
            </div>
            <div className="set-field-lbl">{unit}</div>
          </div>
          <div className="set-sep">×</div>
          <div className="set-field">
            <div
              className={['set-val', reps === '' ? 'empty' : ''].filter(Boolean).join(' ')}
              onClick={() => !done && !skipped && onRepsChange?.('')}
            >
              {reps !== '' ? reps : 'reps'}
            </div>
            <div className="set-field-lbl">reps</div>
          </div>
        </div>
      </div>
      <div className="set-row-foot">
        <button className="set-skip-btn" onClick={onSkip} disabled={done || skipped}>
          Skip
        </button>
        <button className="set-check-btn" onClick={onCheck} disabled={done || skipped}>
          <CheckIcon />
        </button>
      </div>
    </div>
  );
}
