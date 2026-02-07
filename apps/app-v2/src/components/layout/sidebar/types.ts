import type { LucideIcon } from 'lucide-react';

export interface SidebarNavItemConfig {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
}

export interface SidebarNavGroupConfig {
  label: string;
  items: SidebarNavItemConfig[];
}
