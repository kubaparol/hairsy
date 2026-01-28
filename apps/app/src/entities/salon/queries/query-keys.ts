/**
 * Query keys for salon-related queries
 */
export const salonKeys = {
  all: ['salon'] as const,
  byId: (id: string) => [...salonKeys.all, id] as const,
  byOwner: (ownerId: string) => [...salonKeys.all, 'owner', ownerId] as const,
  completeness: (salonId: string) =>
    [...salonKeys.all, salonId, 'completeness'] as const,
};
