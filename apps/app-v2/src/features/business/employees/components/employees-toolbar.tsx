import { Input, Label } from '@heroui/react';
import type {
  EmployeeSortKey,
  EmployeeStatusFilter,
} from '../../../../services/employees/query-keys';

interface EmployeesToolbarProps {
  search: string;
  status: EmployeeStatusFilter;
  sort: EmployeeSortKey;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: EmployeeStatusFilter) => void;
  onSortChange: (value: EmployeeSortKey) => void;
  onReset: () => void;
}

export function EmployeesToolbar({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onReset,
}: EmployeesToolbarProps) {
  return (
    <section
      aria-label="Filtry i sortowanie pracowników"
      className="grid gap-3 rounded-2xl border border-default-200 bg-content1 p-4 md:grid-cols-[2fr_1fr_1fr_auto]"
    >
      <div className="space-y-2">
        <Label htmlFor="employees-search">Wyszukiwarka</Label>
        <Input
          id="employees-search"
          type="search"
          autoComplete="off"
          spellCheck={false}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Wpisz imię lub nazwisko…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employees-status-filter">Status</Label>
        <select
          id="employees-status-filter"
          className="h-10 w-full rounded-xl border border-default-300 bg-content1 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as EmployeeStatusFilter)
          }
        >
          <option value="all">Wszyscy</option>
          <option value="active">Aktywni</option>
          <option value="inactive">Nieaktywni</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employees-sort">Sortowanie</Label>
        <select
          id="employees-sort"
          className="h-10 w-full rounded-xl border border-default-300 bg-content1 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as EmployeeSortKey)
          }
        >
          <option value="default">Domyślne</option>
          <option value="alphabetical">A-Z</option>
          <option value="created_desc">Data dodania: najnowsi</option>
          <option value="created_asc">Data dodania: najstarsi</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={onReset}
          className="h-10 w-full rounded-xl border border-default-300 px-4 text-sm font-medium text-default-700 transition-colors hover:bg-default-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Resetuj
        </button>
      </div>
    </section>
  );
}
