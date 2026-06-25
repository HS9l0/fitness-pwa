export interface ProgressBarProps {
  current: number;
  total: number;
  /** Label suffix, e.g. "sets" → "2 / 4 sets" */
  label?: string;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
