import { createRoute } from '@tanstack/react-router';
import { clientLayoutRoute } from '../layout-route';
import { ClientDashboardPlaceholder } from './client-dashboard-view';

export const clientDashboardRoute = createRoute({
  getParentRoute: () => clientLayoutRoute,
  path: '/',
  component: ClientDashboardPlaceholder,
});
