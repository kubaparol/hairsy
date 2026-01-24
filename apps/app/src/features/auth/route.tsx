import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '@/app/root';

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
  component: () => <div>SignInForm</div>,
});
