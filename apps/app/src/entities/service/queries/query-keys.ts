/**
 * Query keys for service-related queries
 */
export const serviceKeys = {
  all: ['service'] as const,
  byId: (id: string) => [...serviceKeys.all, id] as const,
  bySalon: (salonId: string) => [...serviceKeys.all, 'salon', salonId] as const,
};
