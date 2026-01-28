import { useQuery } from '@tanstack/react-query';
import { checkSalonCompleteness } from '../api';
import { salonKeys } from './query-keys';

/**
 * Hook to check if salon is complete.
 * May change during onboarding, so stale time is short.
 *
 * @example
 * ```tsx
 * function CompletenessIndicator({ salonId }: { salonId: string }) {
 *   const { data: isComplete } = useSalonCompleteness(salonId);
 *
 *   return <div>{isComplete ? 'Complete' : 'Incomplete'}</div>;
 * }
 * ```
 */
export function useSalonCompleteness(salonId: string | undefined) {
  return useQuery<boolean>({
    queryKey: salonKeys.completeness(salonId!),
    queryFn: () => checkSalonCompleteness(salonId!),
    enabled: !!salonId,
    staleTime: 60 * 1000, // 1 minute (may change during onboarding)
  });
}
