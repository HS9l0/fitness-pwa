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
/** One set row — weight + reps inputs with skip and check buttons. */
export declare function SetRow({ setNumber, reps, weight, unit, done, skipped, onCheck, onSkip, onRepsChange, onWeightChange, lastHint, }: SetRowProps): React.JSX.Element;
