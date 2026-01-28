import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSalon, type CreateSalonInput } from '../api';
import { salonKeys } from '../queries/query-keys';
import type { SupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface UseCreateSalonOptions {
  onSuccess?: (data: Tables<'salons'>) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for creating a salon.
 * Automatically invalidates salon queries on success.
 */
export function useCreateSalon(options?: UseCreateSalonOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    Tables<'salons'>,
    SupabaseError,
    { ownerId: string; data: CreateSalonInput }
  >({
    mutationFn: ({ ownerId, data }) => createSalon(ownerId, data),
    onSuccess: (data) => {
      // Invalidate salon queries
      queryClient.invalidateQueries({ queryKey: salonKeys.all });
      queryClient.invalidateQueries({
        queryKey: salonKeys.byOwner(data.owner_id),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
