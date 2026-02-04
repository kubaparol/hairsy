import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/root';
import { LandingPage } from './landing-page';

/**
 * Landing page route (`/`)
 * Strona główna dostępna dla wszystkich użytkowników.
 * Zalogowani użytkownicy mogą zostać na tej stronie lub przejść do /app.
 */
export const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});
