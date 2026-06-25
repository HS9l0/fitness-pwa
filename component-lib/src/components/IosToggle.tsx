import React, { useId } from 'react';

export interface IosToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

/** iOS-style toggle switch — green when on, grey when off. */
export function IosToggle({ checked, onChange, label }: IosToggleProps) {
  const id = useId();
  return (
    <label className="ios-toggle" htmlFor={id} aria-label={label}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="ios-track" />
    </label>
  );
}
