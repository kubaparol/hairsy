import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { createRouter } from '@tanstack/react-router';
import { welcomeRoute } from '../features/welcome/route';
import { businessDashboardRoute } from '../features/business/dashboard/route';
import { signUpAsBusinessRoute } from '../features/auth/sign-up-as-business/route';
import { signInRoute } from '../features/auth/sign-in/route';
import { signUpAsClientRoute } from '../features/auth/sign-up-as-client/route';
import { clientDashboardRoute } from '../features/client/dashboard/route';

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const routeTree = rootRoute.addChildren([
  welcomeRoute,
  signInRoute,
  signUpAsBusinessRoute,
  signUpAsClientRoute,
  businessDashboardRoute,
  clientDashboardRoute,
]);

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
  context: {},
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
