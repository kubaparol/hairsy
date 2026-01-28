import { useQuery } from '@tanstack/react-query';
import { getWorkingHoursBySalon } from '../api';
import { workingHoursKeys } from './query-keys';
import type { Tables } from '@/core/database.types';

/**
 * Hook to fetch working hours for a salon.
 *
 * @example
 * ```tsx
 * function WorkingHoursList({ salonId }: { salonId: string }) {
 *   const { data: hours, isLoading } = useWorkingHoursBySalon(salonId);
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <ul>
 *       {hours.map((h) => (
 *         <li key={h.id}>
 *           Day {h.day_of_week}: {h.open_time} - {h.close_time}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useWorkingHoursBySalon(salonId: string | undefined) {
  return useQuery<Tables<'working_hours'>[]>({
    queryKey: workingHoursKeys.bySalon(salonId!),
    queryFn: () => getWorkingHoursBySalon(salonId!),
    enabled: !!salonId,
    staleTime: 10 * 60 * 1000, // 10 minutes (rarely changes)
  });
}
