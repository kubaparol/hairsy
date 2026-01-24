import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './root';
import { signInRoute } from '@/features/auth/route';
import { appRoute } from '@/features/dashboard/route';

const routeTree = rootRoute.addChildren([signInRoute, appRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
