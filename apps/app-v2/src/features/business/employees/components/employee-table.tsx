import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Button,
  Description,
  Dropdown,
  Header,
  Label,
  Separator,
  Tooltip,
} from '@heroui/react';
import { AlertTriangle, Menu, Pencil, Trash2, Info } from 'lucide-react';
import type { Employee } from '../../../../services/employees/types';
import { EmployeeStatusToggle } from './employee-status-toggle';

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

function EmployeeAvatarWithFallback({
  avatarUrl,
  firstName,
  lastName,
}: {
  avatarUrl?: string | null;
  firstName: string;
  lastName: string;
}) {
  const initials = initialsFromName(firstName, lastName);

  return (
    <div className="relative h-10 w-10 shrink-0">
      {avatarUrl ? (
        <>
          <img
            src={avatarUrl}
            alt={`${firstName} ${lastName}`}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-default-200"
            onError={(e) => {
              e.currentTarget.classList.add('hidden');
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden h-10 w-10 place-items-center rounded-full bg-default-100 text-xs font-semibold text-default-700 ring-1 ring-default-200">
            {initials}
          </div>
        </>
      ) : (
        <div className="grid h-10 w-10 place-items-center rounded-full bg-default-100 text-xs font-semibold text-default-700 ring-1 ring-default-200">
          {initials}
        </div>
      )}
    </div>
  );
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
          return (
            <div className="flex items-center gap-3">
              <EmployeeAvatarWithFallback
                avatarUrl={employee.avatarUrl}
                firstName={employee.firstName}
                lastName={employee.lastName}
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-default-900">
                  {employee.fullName}
                </span>
                {employee.bio && (
                  <Tooltip delay={100}>
                    <Tooltip.Trigger>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs text-default-400 hover:text-default-600 transition-colors"
                      >
                        <Info className="size-3" />
                        <span>Zobacz bio</span>
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content className="max-w-xs">
                      <p className="text-sm">{employee.bio}</p>
                    </Tooltip.Content>
                  </Tooltip>
                )}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => row, {
        id: 'status',
        header: 'Status',
        meta: { className: 'w-[150px]' },
        cell: (info) => {
          const employee = info.getValue();
          return (
            <EmployeeStatusToggle
              employee={employee}
              isPending={isMutating}
              onConfirm={onToggleStatus}
            />
          );
        },
      }),
      columnHelper.accessor('phoneNumber', {
        header: 'Telefon',
        cell: (info) => {
          const value = info.getValue();
          if (!value) return <span className="text-default-400">—</span>;
          return (
            <a
              href={`tel:${value}`}
              className="whitespace-nowrap text-default-700 hover:text-accent transition-colors"
            >
              {value}
            </a>
          );
        },
      }),
      columnHelper.accessor('email', {
        header: 'E-mail',
        cell: (info) => {
          const value = info.getValue();
          if (!value) return <span className="text-default-400">—</span>;
          return (
            <a
              href={`mailto:${value}`}
              className="truncate text-default-700 underline underline-offset-4 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {value}
            </a>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Dodano',
        meta: { className: 'w-[130px]' },
        cell: (info) => (
          <span className="whitespace-nowrap text-default-600">
            {dateFormatter.format(new Date(info.getValue()))}
          </span>
        ),
      }),
      columnHelper.accessor((row) => row, {
        id: 'actions',
        // Pusta nazwa nagłówka, tylko ikona lub sr-only
        header: () => <span className="sr-only">Akcje</span>,
        // Stała wąska szerokość
        meta: { className: 'w-[60px]' },
        cell: (info) => {
          const employee = info.getValue();

          const handleAction = (key: React.Key) => {
            switch (key) {
              case 'edit':
                onEdit(employee);
                break;
              case 'soft-delete':
                onSoftDelete(employee);
                break;
              case 'hard-delete':
                onHardDelete(employee);
                break;
              default:
                break;
            }
          };

          return (
            <div className="flex justify-end">
              <Dropdown>
                <Dropdown.Trigger>
                  <Button
                    isIconOnly
                    aria-label="Akcje pracownika"
                    variant="ghost"
                    size="sm"
                    isDisabled={isMutating}
                    className="hover:bg-default-100"
                  >
                    <Menu className="size-4" />
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Popover
                  className="min-w-[220px]"
                  placement="bottom end"
                >
                  <Dropdown.Menu
                    aria-label="Akcje pracownika"
                    onAction={handleAction}
                    disabledKeys={
                      isMutating ? ['edit', 'soft-delete', 'hard-delete'] : []
                    }
                  >
                    <Dropdown.Section>
                      <Header>Akcje</Header>
                      <Dropdown.Item id="edit" textValue="Edytuj">
                        <div className="flex h-8 items-start justify-center pt-px">
                          <Pencil className="size-4 shrink-0 text-muted" />
                        </div>
                        <div className="flex flex-col">
                          <Label>Edytuj</Label>
                          <Description>Zmień dane pracownika</Description>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Section>
                    <Separator />
                    <Dropdown.Section>
                      <Header>Strefa niebezpieczna</Header>
                      <Dropdown.Item
                        id="soft-delete"
                        textValue="Usuń"
                        variant="danger"
                      >
                        <div className="flex h-8 items-start justify-center pt-px">
                          <Trash2 className="size-4 shrink-0 text-danger" />
                        </div>
                        <div className="flex flex-col">
                          <Label>Usuń</Label>
                          <Description>Przenieś do kosza</Description>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="hard-delete"
                        textValue="Usuń na stałe"
                        variant="danger"
                      >
                        <div className="flex h-8 items-start justify-center pt-px">
                          <AlertTriangle className="size-4 shrink-0 text-danger" />
                        </div>
                        <div className="flex flex-col">
                          <Label>Usuń na stałe</Label>
                          <Description>Nieodwracalne usunięcie</Description>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Section>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-default-300 px-6 py-16 text-center">
        <div className="mb-3 rounded-full bg-default-100 p-3">
          <Info className="size-6 text-default-400" />
        </div>
        <p className="text-default-600">
          Brak pracowników dla bieżących filtrów.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-default-200 bg-content1">
      <table className="w-full min-w-[900px] border-separate border-spacing-0 text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const metaClassName = (
                  header.column.columnDef.meta as { className?: string }
                )?.className;
                return (
                  <th
                    key={header.id}
                    className={`
                      border-b border-default-200 bg-default-50 px-4 py-3 
                      text-left text-xs font-semibold uppercase tracking-wide text-default-500
                      ${metaClassName ?? ''}
                    `}
                    scope="col"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={`
                transition-colors hover:bg-default-50
                ${index === table.getRowModel().rows.length - 1 ? '' : 'border-b'}
              `}
            >
              {row.getVisibleCells().map((cell) => {
                const metaClassName = (
                  cell.column.columnDef.meta as { className?: string }
                )?.className;
                return (
                  <td
                    key={cell.id}
                    className={`
                      border-b border-default-100 px-4 py-3 align-middle
                      ${metaClassName ?? ''}
                    `}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
