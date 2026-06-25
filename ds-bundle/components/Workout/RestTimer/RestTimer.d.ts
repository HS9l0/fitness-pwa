export interface RestTimerProps {
  /** Remaining seconds */
  seconds: number;
  /** Total duration for arc fill ratio */
  totalSeconds: number;
  onSkip?: () => void;
  onAdd?: (extraSeconds: number) => void;
  /** Increment for the add button (default 30) */
  addIncrement?: number;
}
export declare function RestTimer(props: RestTimerProps): JSX.Element;
