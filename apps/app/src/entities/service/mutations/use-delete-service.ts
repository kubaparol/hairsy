import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteService } from '../api';
import { serviceKeys } from '../queries/query-keys';
import { salonKeys } from '@/entities/salon';
import type { SupabaseError } from '@/entities/_shared';

export interface UseDeleteServiceOptions {
  salonId: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for soft-deleting a service (only if no future ONLINE bookings).
 * Invalidates services list and salon completeness on success.
 */
export function useDeleteService(options: UseDeleteServiceOptions) {
  const queryClient = useQueryClient();
  const { salonId } = options;

  return useMutation<void, SupabaseError, string>({
    mutationFn: (serviceId) => deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serviceKeys.bySalon(salonId),
      });
      queryClient.invalidateQueries({
        queryKey: salonKeys.completeness(salonId),
      });
      options.onSuccess?.();
    },
    onError: options.onError,
  });
}
