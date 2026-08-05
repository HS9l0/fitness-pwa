import React from 'react';
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
export declare function DrumPicker({ title, columns, onChange, onDone, onCancel }: DrumPickerProps): React.JSX.Element;
