import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertWorkingHours, type WorkingHoursInput } from '../api';
import { workingHoursKeys } from '../queries/query-keys';
import { salonKeys } from '@/entities/salon';
import type { SupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface UseUpsertWorkingHoursOptions {
  onSuccess?: (data: Tables<'working_hours'>[]) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for creating or updating working hours.
 * Automatically invalidates working hours and salon completeness queries on success.
 */
export function useUpsertWorkingHours(options?: UseUpsertWorkingHoursOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    Tables<'working_hours'>[],
    SupabaseError,
    { salonId: string; data: WorkingHoursInput[] }
  >({
    mutationFn: ({ salonId, data }) => upsertWorkingHours(salonId, data),
    onSuccess: (data, variables) => {
      // Invalidate working hours queries
      queryClient.invalidateQueries({
        queryKey: workingHoursKeys.bySalon(variables.salonId),
      });
      // Invalidate salon completeness
      queryClient.invalidateQueries({
        queryKey: salonKeys.completeness(variables.salonId),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
