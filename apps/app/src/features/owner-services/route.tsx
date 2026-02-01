import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '@/app/root';
import { getProfile } from '@/entities/profile';
import { getSalonByOwner, checkSalonCompleteness } from '@/entities/salon';
import { ServicesPage } from './services-page';

export const ownerServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/services',
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated || !context.auth.session) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.pathname },
      });
    }

    const profile = await getProfile(context.auth.session.user.id);
    if (profile?.role !== 'OWNER') {
      throw redirect({ to: '/app' });
    }

    const salon = await getSalonByOwner(context.auth.session.user.id);
    if (!salon) {
      throw redirect({ to: '/owner/onboarding' });
    }
    const isComplete = await checkSalonCompleteness(salon.id);
    if (!isComplete) {
      throw redirect({ to: '/owner/onboarding' });
    }
  },
  component: ServicesPage,
});
