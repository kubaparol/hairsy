import { createRoute } from '@tanstack/react-router';
import { clientLayoutRoute } from '../layout-route';

export const clientAppointmentsRoute = createRoute({
  getParentRoute: () => clientLayoutRoute,
  path: '/appointments',
  component: () => (
    <div className="py-12 text-center text-default-500">
      Moje wizyty — wkrótce.
    </div>
  ),
});
