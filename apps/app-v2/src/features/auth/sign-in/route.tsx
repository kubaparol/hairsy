import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { SignInView } from './sign-in-view';
import { getRoleBasedDashboard } from '../../../lib/auth-utils';

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/sign-in',
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || undefined,
    };
  },
  beforeLoad: ({ context }) => {
    const { auth } = context;

    if (auth.isAuthenticated && auth.profile) {
      const dashboard = getRoleBasedDashboard(auth.profile.role);
      throw redirect({ to: dashboard });
    }
  },
  component: () => <SignInView />,
});
