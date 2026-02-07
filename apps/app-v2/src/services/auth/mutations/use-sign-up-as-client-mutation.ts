import { useMutation } from '@tanstack/react-query';
import { toast } from '@heroui/react';
import { signUpAsClient } from '../api/sign-up-as-client';

import type {
  SignUpAsClientParams,
  SignUpAsClientResult,
} from '../api/sign-up-as-client';
import { isAppError } from '../../errors';

interface UseSignUpAsClientMutationOptions {
  onSuccess?: (data: SignUpAsClientResult) => void;
  onError?: (error: Error) => void;
}

/**
 * React Query mutation hook for client registration.
 *
 * Usage:
 * ```tsx
 * const { mutate, isPending } = useSignUpAsClientMutation();
 * mutate({ firstName, lastName, email, password, gdprAccepted, termsVersion });
 * ```
 */
export function useSignUpAsClientMutation(
  options?: UseSignUpAsClientMutationOptions,
) {
  return useMutation({
    mutationFn: (params: SignUpAsClientParams) => signUpAsClient(params),
    onSuccess: (data) => {
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
