import React from 'react';
export interface RestTimerProps {
    /** Remaining seconds */
    seconds: number;
    /** Total duration for the arc (determines how full the ring is) */
    totalSeconds: number;
    onSkip?: () => void;
    onAdd?: (extraSeconds: number) => void;
    /** Extra-time increment for the "+30s" button (default 30) */
    addIncrement?: number;
}
/** Floating rest timer — circular arc countdown with skip and add-time buttons. */
export declare function RestTimer({ seconds, totalSeconds, onSkip, onAdd, addIncrement, }: RestTimerProps): React.JSX.Element;
