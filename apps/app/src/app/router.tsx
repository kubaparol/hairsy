import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './root';
import { loginRoute } from '@/features/auth/route';
import { dashboardRoute } from '@/features/dashboard/route';

const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
