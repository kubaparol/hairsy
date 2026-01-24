import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api';
import { profileKeys } from './query-keys';

/**
 * Hook to fetch user profile by user ID.
 *
 * @example
 * ```tsx
 * function ProfileView({ userId }: { userId: string }) {
 *   const { data: profile, isLoading } = useProfile(userId);
 *
 *   if (isLoading) return <Spinner />;
 *   if (!profile) return <div>Profile not found</div>;
 *
 *   return <div>{profile.first_name}</div>;
 * }
 * ```
 */
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.byId(userId!),
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });
}
