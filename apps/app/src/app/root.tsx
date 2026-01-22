import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AppProvider } from './provider';

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </AppProvider>
    </>
  ),
});
