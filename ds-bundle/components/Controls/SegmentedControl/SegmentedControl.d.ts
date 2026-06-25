export interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
