import { createRoute } from '@tanstack/react-router';
import { clientLayoutRoute } from '../layout-route';

export const clientSettingsRoute = createRoute({
  getParentRoute: () => clientLayoutRoute,
  path: '/settings',
  component: () => (
    <div className="py-12 text-center text-default-500">
      Ustawienia — wkrótce.
    </div>
  ),
});
