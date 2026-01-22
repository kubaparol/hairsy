import { createRoute, redirect } from '@tanstack/react-router';
import { supabase } from '@/core/supabase';
import { DashboardPage } from './components/DashboardPage';
import { rootRoute } from '@/app/root';

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: async ({ location }) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (!session || error) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: () => <DashboardPage />,
});
