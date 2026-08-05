import React from 'react';
export interface Stat {
    value: string | number;
    label: string;
}
export interface StatStripProps {
    /** 2–4 stats displayed as equal-width columns */
    stats: Stat[];
}
/** Horizontal strip of large stat numbers — sits below the screen header on the Home screen. */
export declare function StatStrip({ stats }: StatStripProps): React.JSX.Element;
