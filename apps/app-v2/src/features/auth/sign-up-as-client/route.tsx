import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { SignUpAsClientView } from './sign-up-as-client-view';

export const signUpAsClientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/sign-up-as-client',
  beforeLoad: ({ context }) => {
    const { auth } = context;

    if (auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <SignUpAsClientView />,
});
