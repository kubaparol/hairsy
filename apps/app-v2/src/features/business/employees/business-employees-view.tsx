import { useMemo, useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { Users } from 'lucide-react';
import {
  type EmployeeSortKey,
  type EmployeeStatusFilter,
} from '../../../services/employees/query-keys';
import { useEmployeesQuery } from '../../../services/employees/queries/use-employees-query';
import { useEmployeeStatsQuery } from '../../../services/employees/queries/use-employee-stats-query';
import { useCreateEmployeeMutation } from '../../../services/employees/mutations/use-create-employee-mutation';
import { useUpdateEmployeeMutation } from '../../../services/employees/mutations/use-update-employee-mutation';
import { useSetEmployeeStatusMutation } from '../../../services/employees/mutations/use-set-employee-status-mutation';
import { useSoftDeleteEmployeeMutation } from '../../../services/employees/mutations/use-soft-delete-employee-mutation';
import { useHardDeleteEmployeeMutation } from '../../../services/employees/mutations/use-hard-delete-employee-mutation';
import type { Employee } from '../../../services/employees/types';
import type { EmployeeFormValues } from './components/employee-form';
import { DeleteEmployeeModal } from './components/delete-employee-modal';
import { EmployeeFormModal } from './components/employee-form-modal';
import { EmployeeTable } from './components/employee-table';
import { EmployeesStats } from './components/employees-stats';
import { EmployeesToolbar } from './components/employees-toolbar';

type FormMode = 'create' | 'edit' | null;
type DeleteMode = 'soft' | 'hard';

interface DeleteState {
  employee: Employee;
  mode: DeleteMode;
}

export function BusinessEmployeesView() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<EmployeeStatusFilter>('all');
  const [sort, setSort] = useState<EmployeeSortKey>('default');
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);

  const filters = useMemo(
    () => ({
      search,
      status,
      sort,
    }),
    [search, status, sort],
  );

  const {
    data: employees = [],
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    refetch: refetchEmployees,
  } = useEmployeesQuery(filters);

  const { data: stats, isLoading: isStatsLoading } = useEmployeeStatsQuery({
    search,
    status,
  });

  const closeForm = () => {
    setFormMode(null);
    setSelectedEmployee(null);
  };

  const createMutation = useCreateEmployeeMutation({
    onSuccess: closeForm,
  });

  const updateMutation = useUpdateEmployeeMutation({
    onSuccess: closeForm,
  });

  const statusMutation = useSetEmployeeStatusMutation();
  const softDeleteMutation = useSoftDeleteEmployeeMutation({
    onSuccess: () => setDeleteState(null),
  });
  const hardDeleteMutation = useHardDeleteEmployeeMutation({
    onSuccess: () => setDeleteState(null),
  });

  const isAnyMutationPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    statusMutation.isPending ||
    softDeleteMutation.isPending ||
    hardDeleteMutation.isPending;

  const handleFormSubmit = (values: EmployeeFormValues) => {
    if (formMode === 'create') {
      createMutation.mutate(values);
      return;
    }

    if (formMode === 'edit' && selectedEmployee) {
      updateMutation.mutate({
        id: selectedEmployee.id,
        ...values,
      });
    }
  };

  const derivedStats = useMemo(
    () =>
      stats ?? {
        total: 0,
        active: 0,
        inactive: 0,
        recentlyAdded: 0,
      },
    [stats],
  );

  return (
    <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 pb-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Pracownicy</h1>
          <p className="pt-1 text-sm text-default-500">
            Zarządzaj zespołem salonu, statusami i podstawowymi danymi
            kontaktowymi.
          </p>
        </div>
        <Button
          variant="primary"
          onPress={() => {
            setSelectedEmployee(null);
            setFormMode('create');
          }}
        >
          Dodaj pracownika
        </Button>
      </header>

      <EmployeesStats stats={derivedStats} isLoading={isStatsLoading} />

      <EmployeesToolbar
        search={search}
        status={status}
        sort={sort}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onReset={() => {
          setSearch('');
          setStatus('all');
          setSort('default');
        }}
      />

      {formMode ? (
        <EmployeeFormModal
          mode={formMode}
          isOpen
          isPending={createMutation.isPending || updateMutation.isPending}
          employeeName={selectedEmployee?.fullName}
          initialValues={
            selectedEmployee
              ? {
                  firstName: selectedEmployee.firstName,
                  lastName: selectedEmployee.lastName,
                  bio: selectedEmployee.bio,
                  avatarUrl: selectedEmployee.avatarUrl,
                  phoneNumber: selectedEmployee.phoneNumber,
                  email: selectedEmployee.email,
                }
              : undefined
          }
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      ) : null}

      {isEmployeesLoading ? (
        <div
          className="flex items-center justify-center rounded-2xl border border-default-200 p-10 text-default-500"
          aria-live="polite"
        >
          <Spinner />
          <span className="ml-3">Ładowanie pracowników…</span>
        </div>
      ) : null}

      {!isEmployeesLoading && isEmployeesError ? (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6">
          <h2 className="text-base font-semibold text-danger">
            Nie udało się pobrać danych pracowników
          </h2>
          <p className="pt-1 text-sm text-default-600">
            Spróbuj odświeżyć dane. Jeśli problem się powtórzy, sprawdź
            połączenie z bazą.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            onPress={() => refetchEmployees()}
          >
            Odśwież
          </Button>
        </div>
      ) : null}

      {!isEmployeesLoading && !isEmployeesError ? (
        employees.length > 0 ? (
          <EmployeeTable
            employees={employees}
            isMutating={isAnyMutationPending}
            onEdit={(employee) => {
              setSelectedEmployee(employee);
              setFormMode('edit');
            }}
            onToggleStatus={(employee) =>
              statusMutation.mutate({
                id: employee.id,
                isActive: !employee.isActive,
              })
            }
            onSoftDelete={(employee) =>
              setDeleteState({ employee, mode: 'soft' })
            }
            onHardDelete={(employee) =>
              setDeleteState({ employee, mode: 'hard' })
            }
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-default-300 bg-content1 p-10 text-center">
            <Users
              className="mx-auto h-10 w-10 text-default-400"
              aria-hidden="true"
            />
            <h2 className="pt-4 text-lg font-semibold">Brak pracowników</h2>
            <p className="mx-auto max-w-xl pt-1 text-sm text-default-500">
              Dodaj pierwszego pracownika, aby rozpocząć konfigurację zespołu i
              przypisywanie usług.
            </p>
            <Button
              variant="primary"
              className="mt-5"
              onPress={() => {
                setSelectedEmployee(null);
                setFormMode('create');
              }}
            >
              Dodaj pierwszego pracownika
            </Button>
          </div>
        )
      ) : null}

      {deleteState ? (
        <DeleteEmployeeModal
          employee={deleteState.employee}
          mode={deleteState.mode}
          isOpen
          isPending={
            softDeleteMutation.isPending || hardDeleteMutation.isPending
          }
          onClose={() => setDeleteState(null)}
          onConfirm={() => {
            if (deleteState.mode === 'soft') {
              softDeleteMutation.mutate(deleteState.employee.id);
              return;
            }
            hardDeleteMutation.mutate(deleteState.employee.id);
          }}
        />
      ) : null}
    </div>
  );
}
