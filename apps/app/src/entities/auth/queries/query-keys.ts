/**
 * Query keys factory for auth-related queries.
 * Provides type-safe and consistent cache key management.
 *
 * @example
 * ```ts
 * // Invalidate all auth queries
 * queryClient.invalidateQueries({ queryKey: authKeys.all });
 *
 * // Invalidate only session query
 * queryClient.invalidateQueries({ queryKey: authKeys.session() });
 * ```
 */
export const authKeys = {
  /** Base key for all auth-related queries */
  all: ['auth'] as const,

  /** Key for session query */
  session: () => [...authKeys.all, 'session'] as const,

  /** Key for user query */
  user: () => [...authKeys.all, 'user'] as const,
} as const;
