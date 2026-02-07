import { createRoute } from '@tanstack/react-router';
import { businessLayoutRoute } from '../layout-route';

export const businessServicesRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: '/services',
  component: () => (
    <div className="py-12 text-center text-default-500">Usługi — wkrótce.</div>
  ),
});
