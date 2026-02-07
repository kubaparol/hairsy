import {
  Calendar,
  LayoutDashboard,
  Scissors,
  Settings,
  Users,
} from 'lucide-react';
import { createRoute } from '@tanstack/react-router';
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

const placeholderUser = {
  name: 'Mój Salon',
  email: 'salon@example.com',
};

export const businessLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business',
  component: () => (
    <AppLayout
      navigationGroups={businessNavigationGroups}
      userInfo={placeholderUser}
      settingsPath="/business/settings"
    />
  ),
});
