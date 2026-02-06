import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { SignUpAsClientView } from './sign-up-as-client-view';

export const signUpAsClientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/sign-up-as-client',
  component: () => (
    <div>
      <SignUpAsClientView />
    </div>
  ),
});
