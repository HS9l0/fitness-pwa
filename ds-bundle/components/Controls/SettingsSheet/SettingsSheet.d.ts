export interface SettingsRowProps {
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
}
export declare function SettingsRow(props: SettingsRowProps): JSX.Element;

export interface SettingsSectionProps {
  label: string;
  children: React.ReactNode;
}
export declare function SettingsSection(props: SettingsSectionProps): JSX.Element;

export interface SettingsSheetProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}
export declare function SettingsSheet(props: SettingsSheetProps): JSX.Element;
