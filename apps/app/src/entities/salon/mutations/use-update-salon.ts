import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSalon, type UpdateSalonInput } from '../api';
import { salonKeys } from '../queries/query-keys';
import type { SupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface UseUpdateSalonOptions {
  onSuccess?: (data: Tables<'salons'>) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for updating a salon.
 * Automatically invalidates salon queries on success.
 */
export function useUpdateSalon(options?: UseUpdateSalonOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    Tables<'salons'>,
    SupabaseError,
    { salonId: string; updates: UpdateSalonInput }
  >({
    mutationFn: ({ salonId, updates }) => updateSalon(salonId, updates),
    onSuccess: (data) => {
      // Invalidate salon queries
      queryClient.invalidateQueries({ queryKey: salonKeys.all });
      queryClient.invalidateQueries({
        queryKey: salonKeys.byOwner(data.owner_id),
      });
      queryClient.invalidateQueries({
        queryKey: salonKeys.completeness(data.id),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
