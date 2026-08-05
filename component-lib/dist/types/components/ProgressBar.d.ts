import React from 'react';
export interface ProgressBarProps {
    /** Number of completed items */
    current: number;
    /** Total items */
    total: number;
    /** Optional label suffix, e.g. "sets" → "2 / 4 sets" */
    label?: string;
}
/** Sets progress bar — blue (`--accent2`) fill, shows "current / total" count to the right. */
export declare function ProgressBar({ current, total, label }: ProgressBarProps): React.JSX.Element;
