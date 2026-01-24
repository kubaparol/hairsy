/**
 * Query keys for profile-related queries
 */
export const profileKeys = {
  all: ['profile'] as const,
  byId: (id: string) => [...profileKeys.all, id] as const,
};
