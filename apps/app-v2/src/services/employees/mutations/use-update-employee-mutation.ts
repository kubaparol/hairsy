import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@heroui/react';
import { isAppError } from '../../errors';
import { updateEmployee } from '../api/update-employee';
import type { UpdateEmployeeParams } from '../types';
import { employeeKeys } from '../query-keys';

interface UseUpdateEmployeeMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUpdateEmployeeMutation(
  options?: UseUpdateEmployeeMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateEmployeeParams) => updateEmployee(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      toast('Dane pracownika zostały zaktualizowane.', {
        variant: 'success',
        timeout: 3000,
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const message = isAppError(error)
        ? error.message
        : 'Nie udało się zaktualizować pracownika.';
      toast(message, { variant: 'danger', timeout: 5000 });
      options?.onError?.(error);
    },
  });
}
