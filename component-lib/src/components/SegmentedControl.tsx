import React from 'react';

export interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

/** Two-segment control — used for unit switching (kg / lbs). */
export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="unit-seg">
      {options.map(opt => (
        <button
          key={opt}
          className={['unit-seg-btn', opt === value ? 'active' : ''].filter(Boolean).join(' ')}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
