import React, { useState } from 'react';

export interface ExerciseCardProps {
  /** Sequential position in the workout (displayed in the blue circle) */
  number: number;
  name: string;
  /** Comma-separated muscle groups, e.g. "Chest, Triceps" */
  muscles: string;
  /** Short spec string shown in accent colour, e.g. "3 × 10" or "20 min" */
  meta: string;
  /** Whether the card starts expanded */
  defaultOpen?: boolean;
  /** Whether all sets are complete */
  complete?: boolean;
  /** Set rows or other content rendered inside the collapsed body */
  children?: React.ReactNode;
}

const ChevronIcon = () => (
  <svg className="ex-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/**
 * ExerciseCard — collapsible card showing exercise name, muscles, set spec,
 * and an expandable body for set rows or notes.
 */
export function ExerciseCard({
  number,
  name,
  muscles,
  meta,
  defaultOpen = false,
  complete = false,
  children,
}: ExerciseCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const cardClass = [
    'exercise-card',
    open ? 'open' : '',
    complete ? 'ex-complete' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      <div className="ex-header" onClick={() => setOpen(o => !o)}>
        <div className="ex-num">{number}</div>
        <div className="ex-info">
          <div className="ex-name">{name}</div>
          <div className="ex-muscles">{muscles}</div>
        </div>
        <div className="ex-meta">{meta}</div>
        <ChevronIcon />
      </div>
      <div className="ex-body-outer">
        <div className="ex-body">
          {children}
        </div>
      </div>
    </div>
  );
}
