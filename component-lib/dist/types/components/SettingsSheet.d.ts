import React from 'react';
export interface SettingsRowProps {
    label: string;
    children?: React.ReactNode;
    onClick?: () => void;
}
/** Single row inside a SettingsSheet — label on the left, control on the right. */
export declare function SettingsRow({ label, children, onClick }: SettingsRowProps): React.JSX.Element;
export interface SettingsSectionProps {
    label: string;
    children: React.ReactNode;
}
/** Labelled section group inside a SettingsSheet. */
export declare function SettingsSection({ label, children }: SettingsSectionProps): React.JSX.Element;
export interface SettingsSheetProps {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}
/**
 * SettingsSheet — iOS-style bottom sheet with blurred backdrop.
 * Slide up when `open` is true. Pass `SettingsSection` and `SettingsRow` as children.
 */
export declare function SettingsSheet({ open, title, onClose, children }: SettingsSheetProps): React.JSX.Element;
