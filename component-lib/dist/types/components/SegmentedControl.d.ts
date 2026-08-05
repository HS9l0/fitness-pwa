import React from 'react';
export interface SegmentedControlProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}
/** Two-segment control — used for unit switching (kg / lbs). */
export declare function SegmentedControl({ options, value, onChange }: SegmentedControlProps): React.JSX.Element;
