import { useQuery } from '@tanstack/react-query';
import { getEmployeeStats } from '../api/get-employee-stats';
import { employeeKeys, type EmployeeListFilters } from '../query-keys';

export function useEmployeeStatsQuery(
  filters: Pick<EmployeeListFilters, 'status' | 'search'>,
) {
  return useQuery({
    queryKey: employeeKeys.stats(filters),
    queryFn: getEmployeeStats,
    staleTime: 60 * 1000,
  });
}
