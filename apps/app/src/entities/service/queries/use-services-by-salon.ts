import { useQuery } from '@tanstack/react-query';
import { listServicesBySalon } from '../api';
import { serviceKeys } from './query-keys';
import type { Tables } from '@/core/database.types';

/**
 * Hook to fetch all services for a salon.
 *
 * @example
 * ```tsx
 * function ServicesList({ salonId }: { salonId: string }) {
 *   const { data: services, isLoading } = useServicesBySalon(salonId);
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <ul>
 *       {services.map((service) => (
 *         <li key={service.id}>{service.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useServicesBySalon(salonId: string | undefined) {
  return useQuery<Tables<'services'>[]>({
    queryKey: serviceKeys.bySalon(salonId!),
    queryFn: () => listServicesBySalon(salonId!),
    enabled: !!salonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
