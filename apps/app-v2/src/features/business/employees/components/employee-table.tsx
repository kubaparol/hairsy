import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { Employee } from '../../../../services/employees/types';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onToggleStatus: (employee: Employee) => void;
  onSoftDelete: (employee: Employee) => void;
  onHardDelete: (employee: Employee) => void;
  isMutating?: boolean;
}

const columnHelper = createColumnHelper<Employee>();
const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
  dateStyle: 'medium',
});

function initialsFromName(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function EmployeeTable({
  employees,
  onEdit,
  onToggleStatus,
  onSoftDelete,
  onHardDelete,
  isMutating,
}: EmployeeTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row, {
        id: 'name',
        header: 'Pracownik',
        cell: (info) => {
          const employee = info.getValue();
          const initials = initialsFromName(
            employee.firstName,
            employee.lastName,
          );
          return (
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-default-200 bg-default-100 text-xs font-semibold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{employee.fullName}</p>
                <p className="truncate text-xs text-default-500">
                  {employee.bio || 'Brak bio'}
                </p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: (info) =>
          info.getValue() ? (
            <span className="inline-flex rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              Aktywny
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-default-200 px-2.5 py-1 text-xs font-medium text-default-700">
              Nieaktywny
            </span>
          ),
      }),
      columnHelper.accessor('phoneNumber', {
        header: 'Telefon',
        cell: (info) => info.getValue() || '—',
      }),
      columnHelper.accessor('email', {
        header: 'E-mail',
        cell: (info) => {
          const value = info.getValue();
          if (!value) return '—';
          return (
            <a
              href={`mailto:${value}`}
              className="underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {value}
            </a>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Dodano',
        cell: (info) => dateFormatter.format(new Date(info.getValue())),
      }),
      columnHelper.accessor((row) => row, {
        id: 'actions',
        header: 'Akcje',
        cell: (info) => {
          const employee = info.getValue();
          return (
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => onEdit(employee)}
                disabled={isMutating}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-default-700 transition-colors hover:bg-default-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                Edytuj
              </button>
              <button
                type="button"
                onClick={() => onToggleStatus(employee)}
                disabled={isMutating}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-default-700 transition-colors hover:bg-default-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {employee.isActive ? 'Dezaktywuj' : 'Aktywuj'}
              </button>
              <button
                type="button"
                onClick={() => onSoftDelete(employee)}
                disabled={isMutating}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:cursor-not-allowed disabled:opacity-60"
              >
                Usuń
              </button>
              <button
                type="button"
                onClick={() => onHardDelete(employee)}
                disabled={isMutating}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:cursor-not-allowed disabled:opacity-60"
              >
                Usuń na stałe
              </button>
            </div>
          );
        },
      }),
    ],
    [isMutating, onEdit, onHardDelete, onSoftDelete, onToggleStatus],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (employees.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-default-300 p-10 text-center text-default-500">
        Brak pracowników dla bieżących filtrów.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-default-200 bg-content1">
      <table className="w-full min-w-[960px] border-separate border-spacing-0 text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-default-200 bg-default-100/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-default-600"
                  scope="col"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="[&_tr:last-child_td]:border-b-0">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-default-50/70">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b border-default-200 px-4 py-3 align-middle"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
