import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@heroui/react';
import { isAppError } from '../../errors';
import { hardDeleteEmployee } from '../api/hard-delete-employee';
import { employeeKeys } from '../query-keys';

interface UseHardDeleteEmployeeMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useHardDeleteEmployeeMutation(
  options?: UseHardDeleteEmployeeMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hardDeleteEmployee(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      toast('Pracownik został trwale usunięty.', {
        variant: 'success',
        timeout: 3000,
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const message = isAppError(error)
        ? error.message
        : 'Nie udało się trwale usunąć pracownika.';
      toast(message, { variant: 'danger', timeout: 5000 });
      options?.onError?.(error);
    },
  });
}
