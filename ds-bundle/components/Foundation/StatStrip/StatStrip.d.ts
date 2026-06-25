export interface Stat {
  value: string | number;
  label: string;
}
export interface StatStripProps {
  /** 2–4 stats as equal-width columns */
  stats: Stat[];
}
export declare function StatStrip(props: StatStripProps): JSX.Element;
