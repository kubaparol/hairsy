import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { ClientDashboardPlaceholder } from './client-dashboard-view';

export const clientDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client',
  component: ClientDashboardPlaceholder,
});
