import React from 'react';
import { Badge } from './Badge';

export interface ScreenHeaderProps {
  /** Optional pill label above the title, e.g. "WEEK 3 · DAY 2" */
  badge?: string;
  title: string;
  subtitle?: string;
}

/** Page header with gradient background, optional badge, title and subtitle. */
export function ScreenHeader({ badge, title, subtitle }: ScreenHeaderProps) {
  return (
    <div className="screen-header">
      {badge && <Badge>{badge}</Badge>}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
