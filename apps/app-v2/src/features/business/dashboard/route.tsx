import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { BusinessDashboardPlaceholder } from './business-dashboard-view';

export const businessDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business',
  component: BusinessDashboardPlaceholder,
});
