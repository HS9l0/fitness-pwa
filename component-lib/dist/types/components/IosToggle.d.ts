import React from 'react';
export interface IosToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}
/** iOS-style toggle switch — blue (`--accent2`) when on, grey when off. */
export declare function IosToggle({ checked, onChange, label }: IosToggleProps): React.JSX.Element;
