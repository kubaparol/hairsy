import { createRouter } from '@tanstack/react-router';
import { createRootRoute } from '@tanstack/react-router';

import { RootComponent } from './root';
import { indexRoute } from '../pages';
import { aboutRoute } from '../pages/about';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const rootRoute = createRootRoute({
  component: RootComponent,
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

export const router = createRouter({ routeTree });
