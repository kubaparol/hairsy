import { createRoute } from '@tanstack/react-router';
import { businessLayoutRoute } from '../layout-route';

export const businessSettingsRoute = createRoute({
  getParentRoute: () => businessLayoutRoute,
  path: '/settings',
  component: () => (
    <div className="py-12 text-center text-default-500">
      Ustawienia — wkrótce.
    </div>
  ),
});
