import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@heroui/react';
import { isAppError } from '../../errors';
import { softDeleteEmployee } from '../api/soft-delete-employee';
import { employeeKeys } from '../query-keys';

interface UseSoftDeleteEmployeeMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSoftDeleteEmployeeMutation(
  options?: UseSoftDeleteEmployeeMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => softDeleteEmployee(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      toast('Pracownik został usunięty z listy aktywnej.', {
        variant: 'success',
        timeout: 3000,
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const message = isAppError(error)
        ? error.message
        : 'Nie udało się usunąć pracownika.';
      toast(message, { variant: 'danger', timeout: 5000 });
      options?.onError?.(error);
    },
  });
}
