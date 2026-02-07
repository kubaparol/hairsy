import { ClipboardList, Heart, LayoutDashboard, Settings } from 'lucide-react';
import { createRoute } from '@tanstack/react-router';
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

const placeholderUser = {
  name: 'Jan Kowalski',
  email: 'jan@example.com',
};

export const clientLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client',
  component: () => (
    <AppLayout
      navigationGroups={clientNavigationGroups}
      userInfo={placeholderUser}
      settingsPath="/client/settings"
    />
  ),
});
