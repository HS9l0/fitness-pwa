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
export function BottomNav({ items, onSelect }: BottomNavProps) {
  return (
    <nav
      id="bottom-nav"
      style={{
        display: 'flex',
        background: '#0c1520',
        borderTop: '1px solid var(--border)',
        height: 'calc(var(--nav-h) + var(--safe-bottom, 0px))',
        paddingBottom: 'var(--safe-bottom, 0px)',
        flexShrink: 0,
      }}
    >
      {items.map(item => (
        <button
          key={item.id}
          className={['nav-btn', item.active ? 'active' : ''].filter(Boolean).join(' ')}
          onClick={() => onSelect?.(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
