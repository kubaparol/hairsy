import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/root';
import { SalonsPage } from './salons-page';
import { SalonDetailPage } from './salon-detail-page';
import { SalonBookPage } from './salon-book-page';

/** Public list of salons (filter by city). US-011, US-012 */
export const salonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/salons',
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === 'string' ? search.city : undefined,
  }),
  component: SalonsPage,
});

/** Public salon detail and services. US-013 */
export const salonDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/salons/$salonId',
  component: SalonDetailPage,
});

/** Booking flow: time selection (placeholder for 5.4). US-013 proceed to time selection */
export const salonBookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/salons/$salonId/book',
  validateSearch: (search: Record<string, unknown>) => ({
    serviceId:
      typeof search.serviceId === 'string' ? search.serviceId : undefined,
  }),
  component: SalonBookPage,
});
