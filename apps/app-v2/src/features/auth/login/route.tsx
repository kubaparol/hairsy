import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { LoginView } from './login-view';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <div>
      <LoginView />
    </div>
  ),
});
