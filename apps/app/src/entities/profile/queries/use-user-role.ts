import { useSession } from '@/entities/auth';
import { useProfile } from './use-profile';

/**
 * Hook to get the current user's role.
 * Returns null if user is not authenticated or profile doesn't exist.
 *
 * @example
 * ```tsx
 * function DashboardLayout() {
 *   const role = useUserRole();
 *
 *   if (role === 'OWNER') {
 *     return <OwnerDashboard />;
 *   }
 *
 *   return <UserDashboard />;
 * }
 * ```
 */
export function useUserRole() {
  const { data: session } = useSession();
  const { data: profile } = useProfile(session?.user?.id);

  return profile?.role ?? null;
}
