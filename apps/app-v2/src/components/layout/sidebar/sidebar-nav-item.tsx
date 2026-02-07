import { Link } from '@tanstack/react-router';
import { Tooltip } from '@heroui/react';
import type { SidebarNavItemConfig } from './types';

export interface SidebarNavItemProps extends SidebarNavItemConfig {
  isCollapsed?: boolean;
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function SidebarNavItem({
  to,
  label,
  icon: Icon,
  exact = false,
  badge,
  isCollapsed = false,
}: SidebarNavItemProps) {
  const content = (
    <Link
      to={to}
      activeOptions={exact ? { exact: true } : undefined}
      activeProps={{
        className:
          'border-l-accent bg-accent/10 text-accent font-medium [&>svg]:text-accent border-l-2 aria-current="page"',
        'aria-current': 'page',
      }}
      inactiveProps={{
        className:
          'border-l-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-2',
      }}
      className={cn(
        'flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm transition-colors duration-150 [&>svg]:size-5 [&>svg]:shrink-0',
        isCollapsed && 'justify-center px-0',
      )}
    >
      <Icon aria-hidden />
      {!isCollapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {badge != null && badge > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-soft-hover px-1.5 text-xs font-medium text-accent">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip delay={100}>
        <Tooltip.Trigger>{content}</Tooltip.Trigger>
        <Tooltip.Content placement="right">{label}</Tooltip.Content>
      </Tooltip>
    );
  }

  return content;
}
