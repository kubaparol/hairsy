import { useQuery } from '@tanstack/react-query';
import { employeeKeys, type EmployeeListFilters } from '../query-keys';
import { getEmployees } from '../api/get-employees';

export function useEmployeesQuery(filters: EmployeeListFilters) {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => getEmployees(filters),
    staleTime: 60 * 1000,
  });
}
