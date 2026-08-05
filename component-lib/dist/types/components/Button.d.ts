import React from 'react';
export interface ButtonProps {
    /** Visual style of the button */
    variant?: 'primary' | 'ghost';
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    /** Applies the pulsing glow animation — used for the main "Begin" CTA */
    pulsing?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}
/**
 * Button — primary (filled lime, `--accent`) or ghost (bordered, muted).
 *
 * Primary is full-width by default; use inside a container to constrain width.
 * Ghost is inline-flex and wraps its content.
 */
export declare function Button({ variant, children, onClick, disabled, pulsing, type, className, }: ButtonProps): React.JSX.Element;
