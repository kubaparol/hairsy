import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateService, type UpdateServiceInput } from '../api';
import { serviceKeys } from '../queries/query-keys';
import type { SupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface UseUpdateServiceOptions {
  onSuccess?: (data: Tables<'services'>) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for updating a service.
 * Invalidates service and salon services list on success.
 */
export function useUpdateService(options?: UseUpdateServiceOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    Tables<'services'>,
    SupabaseError,
    { serviceId: string; updates: UpdateServiceInput }
  >({
    mutationFn: ({ serviceId, updates }) => updateService(serviceId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: serviceKeys.byId(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: serviceKeys.bySalon(data.salon_id),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
