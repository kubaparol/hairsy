import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../router';

export const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Welcome</div>,
});
