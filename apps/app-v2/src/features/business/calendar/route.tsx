import { createRoute } from '@tanstack/react-router';
import { businessLayoutRoute } from '../layout-route';

export const businessCalendarRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: '/calendar',
  component: () => (
    <div className="py-12 text-center text-default-500">
      Kalendarz — wkrótce.
    </div>
  ),
});
