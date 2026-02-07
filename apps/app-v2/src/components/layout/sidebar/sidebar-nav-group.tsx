import { useSidebarContext } from './sidebar-context';
import { SidebarNavItem } from './sidebar-nav-item';
import type { SidebarNavGroupConfig } from './types';

export interface SidebarNavGroupProps {
  group: SidebarNavGroupConfig;
}

export function SidebarNavGroup({ group }: SidebarNavGroupProps) {
  const { isCollapsed } = useSidebarContext();

  return (
    <div className="space-y-1">
      {!isCollapsed && (
        <h3
          className="px-3 text-xs font-medium uppercase tracking-wider text-muted"
          id={`nav-group-${group.label.replace(/\s+/g, '-').toLowerCase()}`}
        >
          {group.label}
        </h3>
      )}
      {group.items.map((item) => (
        <SidebarNavItem key={item.to} {...item} isCollapsed={isCollapsed} />
      ))}
    </div>
  );
}
