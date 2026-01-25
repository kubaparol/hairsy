import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './root';
import { signInRoute, signUpRoute } from '@/features/auth/route';
import { appRoute } from '@/features/dashboard/route';

const routeTree = rootRoute.addChildren([signInRoute, signUpRoute, appRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultPendingComponent: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  ),
  defaultPendingMinMs: 100,
  context: {
    auth: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
