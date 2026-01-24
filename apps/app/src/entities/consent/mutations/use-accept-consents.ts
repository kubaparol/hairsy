import { useMutation } from '@tanstack/react-query';
import { acceptConsents, type AcceptConsentsInput } from '../api';
import type { SupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface UseAcceptConsentsOptions {
  onSuccess?: (data: Tables<'consents'>[]) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for accepting user consents.
 *
 * @example
 * ```tsx
 * function ConsentForm({ userId }: { userId: string }) {
 *   const { mutate: acceptConsents, isPending } = useAcceptConsents({
 *     onSuccess: () => {
 *       toast.success('Consents recorded!');
 *     },
 *   });
 *
 *   const handleSubmit = (policyVersions: string[]) => {
 *     acceptConsents({
 *       userId,
 *       policyVersions,
 *       userAgent: navigator.userAgent,
 *     });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useAcceptConsents(options?: UseAcceptConsentsOptions) {
  return useMutation<Tables<'consents'>[], SupabaseError, AcceptConsentsInput>({
    mutationFn: acceptConsents,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
