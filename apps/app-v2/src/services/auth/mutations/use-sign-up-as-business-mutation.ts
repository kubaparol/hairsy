import { useMutation } from '@tanstack/react-query';
import { toast } from '@heroui/react';

import {
  signUpAsBusiness,
  type SignUpAsBusinessResult,
} from '../api/sign-up-as-business';
import { isAppError } from '../../errors';

interface UseSignUpAsBusinessMutationOptions {
  onSuccess?: (data: SignUpAsBusinessResult) => void;
  onError?: (error: Error) => void;
}

/**
 * React Query mutation hook for business registration.
 *
 * Features:
 * - Automatic toast notifications for success and errors
 * - AppError-aware error handling with Polish messages
 * - Type-safe mutation parameters and results
 */
export function useSignUpAsBusinessMutation(
  options?: UseSignUpAsBusinessMutationOptions,
) {
  return useMutation({
    mutationFn: signUpAsBusiness,
    onSuccess: (data) => {
      toast('Konto utworzone pomyślnie!', { variant: 'success' });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const message = isAppError(error)
        ? error.message
        : 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie';

      toast(message, { variant: 'danger', timeout: 5000 });
      options?.onError?.(error);
    },
  });
}
