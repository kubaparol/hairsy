/**
 * Query keys for working-hours-related queries
 */
export const workingHoursKeys = {
  all: ['working-hours'] as const,
  bySalon: (salonId: string) =>
    [...workingHoursKeys.all, 'salon', salonId] as const,
};
