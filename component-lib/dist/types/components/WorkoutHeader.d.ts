import React from 'react';
export interface WorkoutHeaderProps {
    title: string;
    subtitle?: string;
    /** Elapsed time string, e.g. "14:32" */
    elapsed?: string;
    onBack?: () => void;
}
/** Sticky workout session header — title + subtitle on the left, elapsed timer on the right. */
export declare function WorkoutHeader({ title, subtitle, elapsed, onBack }: WorkoutHeaderProps): React.JSX.Element;
