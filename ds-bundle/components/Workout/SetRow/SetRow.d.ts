export interface SetRowProps {
  setNumber: number;
  reps?: number | string;
  weight?: number | string;
  unit?: 'kg' | 'lbs';
  done?: boolean;
  skipped?: boolean;
  onCheck?: () => void;
  onSkip?: () => void;
  onRepsChange?: (value: string) => void;
  onWeightChange?: (value: string) => void;
  /** Previous session hint shown above inputs, e.g. "Last time: 80kg × 10" */
  lastHint?: string;
}
export declare function SetRow(props: SetRowProps): JSX.Element;
