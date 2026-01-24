import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '@/app/root';

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: () => <div>App</div>,
});
