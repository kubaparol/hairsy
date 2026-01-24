import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProfile, type CreateProfileInput } from '../api';
import { profileKeys } from '../queries/query-keys';
import type { SupabaseError } from '@/entities/_shared';
import type { Tables } from '@/core/database.types';

export interface UseCreateProfileOptions {
  onSuccess?: (data: Tables<'profiles'>) => void | Promise<void>;
  onError?: (error: SupabaseError) => void;
}

/**
 * Hook for creating a user profile.
 * Automatically invalidates profile queries on success.
 *
 * @example
 * ```tsx
 * function CreateProfileForm() {
 *   const { mutate: createProfile, isPending } = useCreateProfile({
 *     onSuccess: (profile) => {
 *       toast.success('Profile created successfully!');
 *     },
 *   });
 *
 *   const handleSubmit = (data: CreateProfileInput) => {
 *     createProfile(data);
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useCreateProfile(options?: UseCreateProfileOptions) {
  const queryClient = useQueryClient();

  return useMutation<Tables<'profiles'>, SupabaseError, CreateProfileInput>({
    mutationFn: createProfile,
    onSuccess: (data) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
