/**
 * React Query keys for authentication-related queries and mutations.
 * Centralized key management for cache invalidation and consistency.
 */
export const authKeys = {
  all: ['auth'] as const,
  signUp: () => [...authKeys.all, 'sign-up'] as const,
  signIn: () => [...authKeys.all, 'sign-in'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};
