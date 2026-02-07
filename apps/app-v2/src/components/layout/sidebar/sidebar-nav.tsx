import { SidebarNavGroup } from './sidebar-nav-group';
import type { SidebarNavGroupConfig } from './types';

export interface SidebarNavProps {
  groups: SidebarNavGroupConfig[];
}

export function SidebarNav({ groups }: SidebarNavProps) {
  return (
    <nav
      className="flex-1 space-y-6 overflow-y-auto px-3 py-4"
      aria-label="Główne menu"
    >
      {groups.map((group) => (
        <SidebarNavGroup key={group.label} group={group} />
      ))}
    </nav>
  );
}
