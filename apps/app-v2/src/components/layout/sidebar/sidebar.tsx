import { useSidebarContext } from './sidebar-context';
import { SidebarHeader } from './sidebar-header';
import { SidebarNav } from './sidebar-nav';
import { SidebarFooter } from './sidebar-footer';
import type { SidebarNavGroupConfig } from './types';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface SidebarProps {
  navigationGroups: SidebarNavGroupConfig[];
  userInfo: { name: string; email: string };
  settingsPath: string;
  profilePath?: string;
}

export function Sidebar({
  navigationGroups,
  userInfo,
  settingsPath,
  profilePath,
}: SidebarProps) {
  const { isCollapsed, isMobileOpen } = useSidebarContext();

  const isVisible = isMobileOpen;

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-default/40 shadow-xl',
        // Mobile: slide in/out from left
        'transform transition-transform duration-300 ease-out',
        isVisible ? 'translate-x-0' : '-translate-x-full',
        // Desktop: always visible, collapse width instead
        'lg:translate-x-0 lg:shadow-none lg:transition-[width] lg:duration-200',
        isCollapsed ? 'lg:w-16' : 'lg:w-64',
      )}
      aria-label="Nawigacja boczna"
    >
      <SidebarHeader />
      <SidebarNav groups={navigationGroups} />
      <SidebarFooter
        userInfo={userInfo}
        settingsPath={settingsPath}
        profilePath={profilePath}
      />
    </aside>
  );
}
