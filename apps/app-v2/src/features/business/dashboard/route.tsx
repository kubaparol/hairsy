import { createRoute } from '@tanstack/react-router';
import { businessLayoutRoute } from '../layout-route';
import { BusinessDashboardPlaceholder } from './business-dashboard-view';

export const businessDashboardRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: '/',
  component: BusinessDashboardPlaceholder,
});
