import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createService, type CreateServiceInput } from '../api';
import { serviceKeys } from '../queries/query-keys';
import { salonKeys } from '@/entities/salon';
import type { SupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface UseCreateServiceOptions {
  onSuccess?: (data: Tables<'services'>) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for creating a service.
 * Automatically invalidates service and salon completeness queries on success.
 */
export function useCreateService(options?: UseCreateServiceOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    Tables<'services'>,
    SupabaseError,
    { salonId: string; data: CreateServiceInput }
  >({
    mutationFn: ({ salonId, data }) => createService(salonId, data),
    onSuccess: (data) => {
      // Invalidate service queries
      queryClient.invalidateQueries({
        queryKey: serviceKeys.bySalon(data.salon_id),
      });
      // Invalidate salon completeness
      queryClient.invalidateQueries({
        queryKey: salonKeys.completeness(data.salon_id),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
