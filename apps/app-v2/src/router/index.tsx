import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { createRouter } from '@tanstack/react-router';
import { welcomeRoute } from '../features/welcome/route';
import { businessLayoutRoute } from '../features/business/layout-route';
import { businessCalendarRoute } from '../features/business/calendar/route';
import { businessDashboardRoute } from '../features/business/dashboard/route';
import { businessEmployeesRoute } from '../features/business/employees/route';
import { businessServicesRoute } from '../features/business/services/route';
import { businessSettingsRoute } from '../features/business/settings/route';
import { signUpAsBusinessRoute } from '../features/auth/sign-up-as-business/route';
import { signInRoute } from '../features/auth/sign-in/route';
import { signUpAsClientRoute } from '../features/auth/sign-up-as-client/route';
import { clientLayoutRoute } from '../features/client/layout-route';
import { clientAppointmentsRoute } from '../features/client/appointments/route';
import { clientDashboardRoute } from '../features/client/dashboard/route';
import { clientFavoritesRoute } from '../features/client/favorites/route';
import { clientSettingsRoute } from '../features/client/settings/route';
import type { AuthState } from '../lib/auth-types';

export interface RouterContext {
  auth: AuthState;
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});

const routeTree = rootRoute.addChildren([
  welcomeRoute,
  signInRoute,
  signUpAsBusinessRoute,
  signUpAsClientRoute,
  businessLayoutRoute.addChildren([
    businessDashboardRoute,
    businessCalendarRoute,
    businessServicesRoute,
    businessEmployeesRoute,
    businessSettingsRoute,
  ]),
  clientLayoutRoute.addChildren([
    clientDashboardRoute,
    clientAppointmentsRoute,
    clientFavoritesRoute,
    clientSettingsRoute,
  ]),
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
  context: {
    auth: {
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,
    },
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
