import { useQuery } from '@tanstack/react-query';
import {
  listCompleteSalons,
  type SalonFilters,
  type ListCompleteSalonsResult,
} from '../api';
import { salonKeys } from './query-keys';

/**
 * Hook to fetch public listing of complete salons.
 * Results are sorted alphabetically by name.
 * Use filters.city to filter by city (US-011).
 *
 * @example
 * ```tsx
 * const { data } = useCompleteSalons({ city: 'Warszawa' });
 * ```
 */
export function useCompleteSalons(filters?: SalonFilters) {
  return useQuery<ListCompleteSalonsResult>({
    queryKey: salonKeys.completeList(filters),
    queryFn: () => listCompleteSalons(filters),
    enabled: filters != null,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
