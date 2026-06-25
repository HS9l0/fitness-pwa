import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Surface card — dark background, subtle border and shadow. */
export function Card({ children, className = '', style }: CardProps) {
  return (
    <div className={['card', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  );
}
