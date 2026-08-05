import React from 'react';
import { BottomNav } from 'fitness-pwa-ds';

const HomeIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const WorkoutIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4" />
  </svg>
);

const HistoryIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
);

const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)',
  borderRadius: 14,
  overflow: 'hidden',
};

export const HomeActive = () => (
  <div style={surface}>
    <BottomNav
      items={[
        { id: 'home', label: 'Home', icon: HomeIcon, active: true },
        { id: 'workout', label: 'Workout', icon: WorkoutIcon },
        { id: 'history', label: 'History', icon: HistoryIcon },
      ]}
      onSelect={() => {}}
    />
  </div>
);

export const WorkoutActive = () => (
  <div style={surface}>
    <BottomNav
      items={[
        { id: 'home', label: 'Home', icon: HomeIcon },
        { id: 'workout', label: 'Workout', icon: WorkoutIcon, active: true },
        { id: 'history', label: 'History', icon: HistoryIcon },
      ]}
      onSelect={() => {}}
    />
  </div>
);

export const TwoTabs = () => (
  <div style={surface}>
    <BottomNav
      items={[
        { id: 'home', label: 'Home', icon: HomeIcon, active: true },
        { id: 'workout', label: 'Workout', icon: WorkoutIcon },
      ]}
      onSelect={() => {}}
    />
  </div>
);
