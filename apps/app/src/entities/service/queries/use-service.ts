import { useQuery } from '@tanstack/react-query';
import { getService } from '../api';
import { serviceKeys } from './query-keys';
import type { Tables } from '@/core/database.types';

/**
 * Hook to fetch a single service by ID.
 *
 * @example
 * ```tsx
 * const { data: service } = useService(serviceId);
 * ```
 */
export function useService(serviceId: string | undefined) {
  return useQuery<Tables<'services'> | null>({
    queryKey: serviceKeys.byId(serviceId!),
    queryFn: () => getService(serviceId!),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
