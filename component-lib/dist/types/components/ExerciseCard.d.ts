import React from 'react';
export interface ExerciseCardProps {
    /** Sequential position in the workout (displayed in the lime circle) */
    number: number;
    name: string;
    /** Comma-separated muscle groups, e.g. "Chest, Triceps" */
    muscles: string;
    /** Short spec string shown in accent colour, e.g. "3 × 10" or "20 min" */
    meta: string;
    /** Whether the card starts expanded */
    defaultOpen?: boolean;
    /** Whether all sets are complete */
    complete?: boolean;
    /** Set rows or other content rendered inside the collapsed body */
    children?: React.ReactNode;
}
/**
 * ExerciseCard — collapsible card showing exercise name, muscles, set spec,
 * and an expandable body for set rows or notes.
 */
export declare function ExerciseCard({ number, name, muscles, meta, defaultOpen, complete, children, }: ExerciseCardProps): React.JSX.Element;
