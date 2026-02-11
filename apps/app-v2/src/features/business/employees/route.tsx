import { createRoute } from '@tanstack/react-router';
import { businessLayoutRoute } from '../layout-route';
import { BusinessEmployeesView } from './business-employees-view';

export const businessEmployeesRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: '/employees',
  component: BusinessEmployeesView,
});
