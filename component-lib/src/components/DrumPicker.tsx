import React, { useRef, useEffect } from 'react';

export interface DrumColumn {
  items: (string | number)[];
  value: string | number;
  label?: string;
  /** Narrow column for fractions (e.g. ".5") */
  narrow?: boolean;
}

export interface DrumPickerProps {
  title?: string;
  columns: DrumColumn[];
  onChange: (columnIndex: number, value: string | number) => void;
  onDone: () => void;
  onCancel: () => void;
}

/**
 * DrumPicker — iOS-style bottom-sheet scroll picker.
 * Each column snap-scrolls independently; selected value is centred in the highlight band.
 */
export function DrumPicker({ title, columns, onChange, onDone, onCancel }: DrumPickerProps) {
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    columns.forEach((col, ci) => {
      const el = scrollRefs.current[ci];
      if (!el) return;
      const idx = col.items.indexOf(col.value);
      if (idx < 0) return;
      el.scrollTop = idx * 44;
    });
  }, []);

  const handleScroll = (ci: number) => {
    const el = scrollRefs.current[ci];
    if (!el) return;
    const idx = Math.round(el.scrollTop / 44);
    const val = columns[ci].items[Math.min(idx, columns[ci].items.length - 1)];
    if (val !== undefined) onChange(ci, val);
  };

  return (
    <div className="drum-sheet">
      <div className="drum-backdrop" onClick={onCancel} />
      <div className="drum-panel">
        <div className="drum-hdr">
          <button className="drum-cancel-btn" onClick={onCancel}>Cancel</button>
          {title && <span className="drum-hdr-title">{title}</span>}
          <button className="drum-done-btn" onClick={onDone}>Done</button>
        </div>
        <div className={['drum-body', columns.length === 1 ? 'drum-body-single' : ''].filter(Boolean).join(' ')}>
          <div className="drum-band" />
          <div className="drum-fade" />
          {columns.map((col, ci) => (
            <div key={ci} className={['drum-col', col.narrow ? 'drum-col-frac' : ''].filter(Boolean).join(' ')}>
              <div
                className="drum-scroll"
                ref={el => { scrollRefs.current[ci] = el; }}
                onScroll={() => handleScroll(ci)}
              >
                {col.items.map((item, ii) => (
                  <div key={ii} className="drum-item">{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {columns.some(c => c.label) && (
          <div className="drum-lbl-row">
            {columns.map((col, ci) => (
              <div key={ci} className="drum-col-lbl">{col.label ?? ''}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
