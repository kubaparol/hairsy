import { useQuery } from '@tanstack/react-query';
import { getSalonByOwner } from '../api';
import { salonKeys } from './query-keys';
import type { Tables } from '@/core/database.types';

/**
 * Hook to fetch salon for a specific owner.
 * Owner can see their salon even if incomplete.
 *
 * @example
 * ```tsx
 * function SalonView({ ownerId }: { ownerId: string }) {
 *   const { data: salon, isLoading } = useSalonByOwner(ownerId);
 *
 *   if (isLoading) return <Spinner />;
 *   if (!salon) return <div>No salon found</div>;
 *
 *   return <div>{salon.name}</div>;
 * }
 * ```
 */
export function useSalonByOwner(ownerId: string | undefined) {
  return useQuery<Tables<'salons'> | null>({
    queryKey: salonKeys.byOwner(ownerId!),
    queryFn: () => getSalonByOwner(ownerId!),
    enabled: !!ownerId,
    staleTime: 2 * 60 * 1000, // 2 minutes (may change during onboarding)
  });
}
