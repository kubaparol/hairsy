import { Separator } from '@heroui/react';
import { useSidebarContext } from './sidebar-context';
import { UserDropdown } from '../user-dropdown';

export interface SidebarFooterProps {
  userInfo: { name: string; email: string };
  settingsPath: string;
  profilePath?: string;
}

export function SidebarFooter({
  userInfo,
  settingsPath,
  profilePath,
}: SidebarFooterProps) {
  const { isCollapsed } = useSidebarContext();

  return (
    <div className="shrink-0 px-3 py-3">
      <Separator className="mb-3" />
      <div className="mx-0 mb-0">
        <UserDropdown
          user={userInfo}
          isCollapsed={isCollapsed}
          settingsPath={settingsPath}
          profilePath={profilePath}
        />
      </div>
    </div>
  );
}
