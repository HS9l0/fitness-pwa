export interface ExerciseCardProps {
  /** Position number shown in the blue circle */
  number: number;
  name: string;
  /** Comma-separated muscles, e.g. "Chest, Triceps" */
  muscles: string;
  /** Short spec in accent colour, e.g. "3 × 10" or "20 min" */
  meta: string;
  defaultOpen?: boolean;
  /** All sets complete — turns the number circle green */
  complete?: boolean;
  /** SetRows and ProgressBar go here */
  children?: React.ReactNode;
}
export declare function ExerciseCard(props: ExerciseCardProps): JSX.Element;
