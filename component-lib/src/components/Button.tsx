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
 * Button — primary (filled blue) or ghost (bordered, muted).
 *
 * Primary is full-width by default; use inside a container to constrain width.
 * Ghost is inline-flex and wraps its content.
 */
export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  pulsing,
  type = 'button',
  className = '',
}: ButtonProps) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  const pulseClass = pulsing ? 'btn-pulse' : '';
  return (
    <button
      type={type}
      className={[base, pulseClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      style={pulsing ? { animation: 'btn-pulse 1.8s ease-in-out infinite' } : undefined}
    >
      {children}
    </button>
  );
}
