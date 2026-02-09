import {
  Calendar,
  LayoutDashboard,
  Scissors,
  Settings,
  Users,
} from 'lucide-react';
import { createRoute, redirect } from '@tanstack/react-router';
import { AppLayout } from '../../components/layout/app-layout';
import { rootRoute } from '../../router';
import type { SidebarNavGroupConfig } from '../../components/layout/sidebar';

const businessNavigationGroups: SidebarNavGroupConfig[] = [
  {
    label: 'Zarządzanie',
    items: [
      {
        to: '/business',
        label: 'Dashboard',
        icon: LayoutDashboard,
        exact: true,
      },
      { to: '/business/calendar', label: 'Kalendarz', icon: Calendar },
      { to: '/business/services', label: 'Usługi', icon: Scissors },
      { to: '/business/employees', label: 'Pracownicy', icon: Users },
    ],
  },
  {
    label: 'Konto',
    items: [{ to: '/business/settings', label: 'Ustawienia', icon: Settings }],
  },
];

export const businessLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business',
  beforeLoad: async ({ context, location }) => {
    const { auth } = context;

    // Not authenticated → redirect to sign-in with return URL
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/auth/sign-in',
        search: {
          redirect: location.href,
        },
      });
    }

    // Authenticated but not OWNER → redirect to client dashboard
    if (auth.profile?.role !== 'OWNER') {
      throw redirect({
        to: '/client',
      });
    }

    // User has access - return auth data for child routes
    return { user: auth.user, profile: auth.profile };
  },
  component: () => {
    const { user } = businessLayoutRoute.useRouteContext();

    const userInfo = {
      name: 'TODO: Mój Salon',
      email: user?.email || '',
    };

    return (
      <AppLayout
        navigationGroups={businessNavigationGroups}
        userInfo={userInfo}
        settingsPath="/business/settings"
      />
    );
  },
});
