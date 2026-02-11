export type EmployeeStatusFilter = 'all' | 'active' | 'inactive';
export type EmployeeSortKey =
  | 'default'
  | 'alphabetical'
  | 'created_desc'
  | 'created_asc';

export interface EmployeeListFilters {
  status: EmployeeStatusFilter;
  search: string;
  sort: EmployeeSortKey;
}

export const employeeKeys = {
  all: ['employees'] as const,
  list: (filters: EmployeeListFilters) =>
    [...employeeKeys.all, 'list', filters] as const,
  stats: (filters: Pick<EmployeeListFilters, 'status' | 'search'>) =>
    [...employeeKeys.all, 'stats', filters] as const,
  detail: (id: string) => [...employeeKeys.all, 'detail', id] as const,
};
