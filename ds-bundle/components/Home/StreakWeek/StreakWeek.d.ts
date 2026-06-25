export type StreakDayState = 'done' | 'today' | 'empty';
export interface StreakDay {
  /** Single letter: 'M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S' */
  label: string;
  state: StreakDayState;
}
export interface StreakWeekProps {
  /** Exactly 7 days, Monday → Sunday */
  days: StreakDay[];
}
export declare function StreakWeek(props: StreakWeekProps): JSX.Element;
