import React from 'react';
export interface ScreenHeaderProps {
    /** Optional pill label above the title, e.g. "WEEK 3 · DAY 2" */
    badge?: string;
    title: string;
    subtitle?: string;
}
/** Page header with gradient background, optional badge, title and subtitle. */
export declare function ScreenHeader({ badge, title, subtitle }: ScreenHeaderProps): React.JSX.Element;
