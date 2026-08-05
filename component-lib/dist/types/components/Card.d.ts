import React from 'react';
export interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
/** Surface card — dark background, subtle border and shadow. */
export declare function Card({ children, className, style }: CardProps): React.JSX.Element;
