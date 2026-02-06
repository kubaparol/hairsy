import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { SignInView } from './sign-in-view';

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/sign-in',
  component: () => (
    <div>
      <SignInView />
    </div>
  ),
});
