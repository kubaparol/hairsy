import { createRoute } from '@tanstack/react-router';
import { clientLayoutRoute } from '../layout-route';

export const clientFavoritesRoute = createRoute({
  getParentRoute: () => clientLayoutRoute,
  path: '/favorites',
  component: () => (
    <div className="py-12 text-center text-default-500">
      Ulubione — wkrótce.
    </div>
  ),
});
