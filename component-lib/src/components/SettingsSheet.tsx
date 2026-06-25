import React from 'react';

export interface SettingsRowProps {
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

/** Single row inside a SettingsSheet — label on the left, control on the right. */
export function SettingsRow({ label, children, onClick }: SettingsRowProps) {
  return (
    <div className="settings-row" onClick={onClick}>
      <span className="settings-row-label">{label}</span>
      {children}
    </div>
  );
}

export interface SettingsSectionProps {
  label: string;
  children: React.ReactNode;
}

/** Labelled section group inside a SettingsSheet. */
export function SettingsSection({ label, children }: SettingsSectionProps) {
  return (
    <>
      <div className="settings-section-label">{label}</div>
      {children}
    </>
  );
}

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
export function SettingsSheet({ open, title = 'Settings', onClose, children }: SettingsSheetProps) {
  return (
    <div className={['settings-sheet', open ? 'open' : ''].filter(Boolean).join(' ')}>
      <div className="settings-backdrop" onClick={onClose} />
      <div className="settings-panel">
        <div className="settings-panel-hdr">
          <span className="settings-panel-title">{title}</span>
          <button className="settings-done-btn" onClick={onClose}>Done</button>
        </div>
        <div className="settings-body">{children}</div>
      </div>
    </div>
  );
}
