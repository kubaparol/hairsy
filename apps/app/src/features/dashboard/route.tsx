import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '@/app/root';
import { getProfile } from '@/entities/profile';
import { getSalonByOwner, checkSalonCompleteness } from '@/entities/salon';
import { AppPage } from './app-page';

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.pathname,
        },
      });
    }

    // US-004: OWNER without complete salon → onboarding
    const profile = await getProfile(context.auth.session!.user.id);
    if (profile?.role === 'OWNER') {
      const salon = await getSalonByOwner(context.auth.session!.user.id);
      if (!salon) {
        throw redirect({ to: '/owner/onboarding' });
      }
      const isComplete = await checkSalonCompleteness(salon.id);
      if (!isComplete) {
        throw redirect({ to: '/owner/onboarding' });
      }
    }
  },
  component: AppPage,
});
