export interface WorkoutHeaderProps {
  title: string;
  subtitle?: string;
  /** Elapsed time string, e.g. "14:32" */
  elapsed?: string;
  onBack?: () => void;
}
export declare function WorkoutHeader(props: WorkoutHeaderProps): JSX.Element;
