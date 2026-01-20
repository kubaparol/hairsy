import { protectedLayoutRoute } from '@/cross-shell/routing/roots';
import { AppRoutes } from '@/ipc/routes';
import { createRoute } from '@tanstack/react-router';

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: AppRoutes.DASHBOARD,
  component: () => <div>Dashboard Page</div>,
});

const mainRoutes = [dashboardRoute];

export { dashboardRoute, mainRoutes };
