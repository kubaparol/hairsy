import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '@/app/root';
import { SignInPage, SignUpPage } from './components';

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-in',
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || undefined,
    };
  },
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/app',
      });
    }
  },
  component: SignInPage,
});

export const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-up',
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/app',
      });
    }
  },
  component: SignUpPage,
});
