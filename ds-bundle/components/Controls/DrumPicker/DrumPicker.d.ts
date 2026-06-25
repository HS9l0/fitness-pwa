export interface DrumColumn {
  items: (string | number)[];
  value: string | number;
  label?: string;
  /** Narrow column for short values like ".5" */
  narrow?: boolean;
}
export interface DrumPickerProps {
  title?: string;
  columns: DrumColumn[];
  onChange: (columnIndex: number, value: string | number) => void;
  onDone: () => void;
  onCancel: () => void;
}
export declare function DrumPicker(props: DrumPickerProps): JSX.Element;
