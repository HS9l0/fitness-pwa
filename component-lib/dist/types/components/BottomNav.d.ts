import React from 'react';
export interface NavItem {
    id: string;
    label: string;
    /** SVG icon element */
    icon: React.ReactNode;
    active?: boolean;
}
export interface BottomNavProps {
    items: NavItem[];
    onSelect?: (id: string) => void;
}
/** Mobile bottom navigation bar — icon + label tabs with active highlight pill. */
export declare function BottomNav({ items, onSelect }: BottomNavProps): React.JSX.Element;
