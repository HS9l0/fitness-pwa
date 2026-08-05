import React from 'react';
export type StreakDayState = 'done' | 'today' | 'empty';
export interface StreakDay {
    /** Single-letter label: 'M', 'T', 'W', 'T', 'F', 'S', 'S' */
    label: string;
    state: StreakDayState;
}
export interface StreakWeekProps {
    /** Exactly 7 days, Monday → Sunday */
    days: StreakDay[];
}
/** 7-day streak row — filled dot for completed days, outlined for today, dim for empty. */
export declare function StreakWeek({ days }: StreakWeekProps): React.JSX.Element;
