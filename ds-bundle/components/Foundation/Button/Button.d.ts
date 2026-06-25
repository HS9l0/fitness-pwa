export interface ButtonProps {
  /** @default 'primary' */
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Pulsing glow animation — use for the main CTA only (e.g. "Begin Workout") */
  pulsing?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
