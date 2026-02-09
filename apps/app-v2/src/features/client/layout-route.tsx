import { ClipboardList, Heart, LayoutDashboard, Settings } from 'lucide-react';
import { createRoute, redirect } from '@tanstack/react-router';
import { AppLayout } from '../../components/layout/app-layout';
import { rootRoute } from '../../router';
import type { SidebarNavGroupConfig } from '../../components/layout/sidebar';

const clientNavigationGroups: SidebarNavGroupConfig[] = [
  {
    label: 'Nawigacja',
    items: [
      {
        to: '/client',
        label: 'Dashboard',
        icon: LayoutDashboard,
        exact: true,
      },
      { to: '/client/appointments', label: 'Moje wizyty', icon: ClipboardList },
      { to: '/client/favorites', label: 'Ulubione', icon: Heart },
    ],
  },
  {
    label: 'Konto',
    items: [{ to: '/client/settings', label: 'Ustawienia', icon: Settings }],
  },
];

export const clientLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client',
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

    // Authenticated but not USER → redirect to business dashboard
    if (auth.profile?.role !== 'USER') {
      throw redirect({
        to: '/business',
      });
    }

    // User has access - return auth data for child routes
    return { user: auth.user, profile: auth.profile };
  },
  component: () => {
    const { user } = clientLayoutRoute.useRouteContext();

    const userInfo = {
      name: user?.email?.split('@')[0] || 'Użytkownik',
      email: user?.email || '',
    };

    return (
      <AppLayout
        navigationGroups={clientNavigationGroups}
        userInfo={userInfo}
        settingsPath="/client/settings"
      />
    );
  },
});
