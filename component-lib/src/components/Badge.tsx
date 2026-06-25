import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
}

/** Pill badge — accent-blue tinted, uppercase, for labels like "WEEK 3 · DAY 2". */
export function Badge({ children }: BadgeProps) {
  return <span className="badge">{children}</span>;
}
