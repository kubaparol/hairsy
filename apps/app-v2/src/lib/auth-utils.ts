import type { UserRole } from './auth-types';

/**
 * Returns the appropriate dashboard path for a given user role
 */
export function getRoleBasedDashboard(role: UserRole): string {
  switch (role) {
    case 'OWNER':
      return '/business';
    case 'USER':
      return '/client';
    default:
      // Fallback to root if role is unknown
      return '/';
  }
}

/**
 * Checks if a user's role matches the required role
 */
export function isRoleAuthorized(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  return userRole === requiredRole;
}
