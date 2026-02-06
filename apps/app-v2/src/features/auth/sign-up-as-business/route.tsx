import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { SignUpAsBusinessView } from './sign-up-as-business-view';

export const signUpAsBusinessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/sign-up-as-business',
  component: () => (
    <div>
      <SignUpAsBusinessView />
    </div>
  ),
});
