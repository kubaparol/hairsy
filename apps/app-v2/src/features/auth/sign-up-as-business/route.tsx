import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { SignUpAsBusinessView } from './sign-up-as-business-view';

export const signUpAsBusinessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/sign-up-as-business',
  beforeLoad: ({ context }) => {
    const { auth } = context;

    if (auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <SignUpAsBusinessView />,
});
