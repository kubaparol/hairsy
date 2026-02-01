import { useQuery } from '@tanstack/react-query';
import { getSalon } from '../api';
import { salonKeys } from './query-keys';
import type { Tables } from '@/core/database.types';

/**
 * Hook to fetch salon by ID.
 * Public: only complete salons visible. Owner: can see own salon (even incomplete).
 *
 * @example
 * ```tsx
 * const { data: salon } = useSalon(salonId);
 * if (!salon) return <SalonUnavailable />;
 * ```
 */
export function useSalon(salonId: string | undefined) {
  return useQuery<Tables<'salons'> | null>({
    queryKey: salonKeys.byId(salonId!),
    queryFn: () => getSalon(salonId!),
    enabled: !!salonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
