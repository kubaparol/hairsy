import { useRef, useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { AppHeader } from './header';
import { SidebarProvider, useSidebarContext } from './sidebar';
import { Sidebar } from './sidebar';
import type { SidebarNavGroupConfig } from './sidebar';

const BACKDROP_CLOSE_DELAY_MS = 150;

export interface AppLayoutProps {
  navigationGroups: SidebarNavGroupConfig[];
  userInfo: { name: string; email: string };
  settingsPath: string;
  profilePath?: string;
}

function AppLayoutContent({
  navigationGroups,
  userInfo,
  settingsPath,
  profilePath,
}: AppLayoutProps) {
  const { isMobileOpen, toggle, closeMobile, isCollapsed } =
    useSidebarContext();
  const openSinceRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMobileOpen) openSinceRef.current = Date.now();
    else openSinceRef.current = null;
  }, [isMobileOpen]);

  const handleBackdropClick = () => {
    const openSince = openSinceRef.current;
    if (openSince == null) return;
    if (Date.now() - openSince < BACKDROP_CLOSE_DELAY_MS) return;
    closeMobile();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded focus:bg-background focus:p-4 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Przejdź do głównej treści
      </a>

      <Sidebar
        navigationGroups={navigationGroups}
        userInfo={userInfo}
        settingsPath={settingsPath}
        profilePath={profilePath}
      />

      {/* Animated overlay for mobile drawer */}
      <button
        type="button"
        aria-label="Zamknij menu"
        aria-hidden={!isMobileOpen}
        tabIndex={isMobileOpen ? 0 : -1}
        className={cn(
          'fixed inset-0 z-40 bg-overlay/80 backdrop-blur-sm transition-opacity duration-200 ease-out lg:pointer-events-none lg:opacity-0',
          isMobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
        onClick={handleBackdropClick}
      />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-200 ease-out',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64',
        )}
      >
        <AppHeader onMenuClick={toggle} />
        <main
          id="main-content"
          className="flex-1 overflow-auto p-4 lg:p-6"
          role="main"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function AppLayout(props: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent {...props} />
    </SidebarProvider>
  );
}
