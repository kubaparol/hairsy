import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@heroui/react';
import { isAppError } from '../../errors';
import {
  setEmployeeStatus,
  type SetEmployeeStatusParams,
} from '../api/set-employee-status';
import { employeeKeys } from '../query-keys';

interface UseSetEmployeeStatusMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSetEmployeeStatusMutation(
  options?: UseSetEmployeeStatusMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SetEmployeeStatusParams) => setEmployeeStatus(params),
    onSuccess: async (_, params) => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      toast(
        params.isActive
          ? 'Pracownik został aktywowany.'
          : 'Pracownik został dezaktywowany.',
        { variant: 'success', timeout: 3000 },
      );
      options?.onSuccess?.();
    },
    onError: (error) => {
      const message = isAppError(error)
        ? error.message
        : 'Nie udało się zmienić statusu pracownika.';
      toast(message, { variant: 'danger', timeout: 5000 });
      options?.onError?.(error);
    },
  });
}
