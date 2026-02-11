import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@heroui/react';
import { isAppError } from '../../errors';
import { createEmployee } from '../api/create-employee';
import type { CreateEmployeeParams } from '../types';
import { employeeKeys } from '../query-keys';

interface UseCreateEmployeeMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCreateEmployeeMutation(
  options?: UseCreateEmployeeMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateEmployeeParams) => createEmployee(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      toast('Pracownik został dodany.', { variant: 'success', timeout: 3000 });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const message = isAppError(error)
        ? error.message
        : 'Nie udało się dodać pracownika.';
      toast(message, { variant: 'danger', timeout: 5000 });
      options?.onError?.(error);
    },
  });
}
