import { publicLayoutRoute } from '@/cross-shell/routing/roots';
import { AppRoutes } from '@/ipc/routes';
import { createRoute } from '@tanstack/react-router';

const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: AppRoutes.LOGIN,
  component: () => <div>Login Page</div>,
});

const publicRoutes = [loginRoute];

export { loginRoute, publicRoutes };
