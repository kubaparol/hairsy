import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../router';
import { ThemeShowcase } from './theme-showcase';

export const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ThemeShowcase,
});
