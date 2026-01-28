import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '@/app/root';
import { OnboardingWizard } from './components';
import { getProfile } from '@/entities/profile';
import { getSalonByOwner } from '@/entities/salon';
import { checkSalonCompleteness } from '@/entities/salon';

export const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/onboarding',
  beforeLoad: async ({ context }) => {
    // Check authentication
    if (!context.auth.isAuthenticated || !context.auth.session) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: '/owner/onboarding',
        },
      });
    }

    // Check role
    const profile = await getProfile(context.auth.session.user.id);
    if (profile?.role !== 'OWNER') {
      throw redirect({
        to: '/app',
      });
    }

    // Check if salon is already complete
    const salon = await getSalonByOwner(context.auth.session.user.id);
    if (salon) {
      const isComplete = await checkSalonCompleteness(salon.id);
      if (isComplete) {
        // Salon is complete, redirect to dashboard
        throw redirect({
          to: '/app',
        });
      }
    }
  },
  component: OnboardingWizard,
});
