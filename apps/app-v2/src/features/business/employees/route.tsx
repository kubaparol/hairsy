import { createRoute } from '@tanstack/react-router';
import { businessLayoutRoute } from '../layout-route';

export const businessEmployeesRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: '/employees',
  component: () => (
    <div className="py-12 text-center text-default-500">
      Pracownicy — wkrótce.
    </div>
  ),
});
