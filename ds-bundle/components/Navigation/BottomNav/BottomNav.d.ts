export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}
export interface BottomNavProps {
  items: NavItem[];
  onSelect?: (id: string) => void;
}
export declare function BottomNav(props: BottomNavProps): JSX.Element;
