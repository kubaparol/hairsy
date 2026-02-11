import { useMemo, useState } from 'react';
import { Button, Card, Spinner } from '@heroui/react';
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
import {
  EmployeeForm,
  type EmployeeFormValues,
} from './components/employee-form';
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
        <Card>
          <Card.Header className="flex items-center justify-between gap-4 border-b border-default-200 px-6 py-4">
            <div>
              <Card.Title>
                {formMode === 'create'
                  ? 'Nowy pracownik'
                  : `Edycja: ${selectedEmployee?.fullName ?? ''}`}
              </Card.Title>
              <Card.Description>
                Uzupełnij wymagane pola, aby zapisać pracownika.
              </Card.Description>
            </div>
          </Card.Header>
          <Card.Content className="p-6">
            <EmployeeForm
              mode={formMode}
              isPending={createMutation.isPending || updateMutation.isPending}
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
              onCancel={closeForm}
              onSubmit={handleFormSubmit}
            />
          </Card.Content>
        </Card>
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
        <div
          className="fixed inset-0 z-120 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="employees-delete-title"
            className="w-full max-w-lg rounded-2xl border border-default-200 bg-content1 p-6 shadow-xl"
          >
            <h3 id="employees-delete-title" className="text-xl font-semibold">
              {deleteState.mode === 'soft'
                ? 'Usunąć pracownika z aktywnej listy?'
                : 'Trwale usunąć pracownika?'}
            </h3>
            <p className="pt-2 text-sm text-default-600">
              {deleteState.mode === 'soft'
                ? `Pracownik ${deleteState.employee.fullName} zostanie dezaktywowany i ukryty na liście.`
                : `Pracownik ${deleteState.employee.fullName} zostanie bezpowrotnie usunięty.`}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onPress={() => setDeleteState(null)}>
                Anuluj
              </Button>
              <Button
                variant="danger"
                isPending={
                  softDeleteMutation.isPending || hardDeleteMutation.isPending
                }
                onPress={() => {
                  if (deleteState.mode === 'soft') {
                    softDeleteMutation.mutate(deleteState.employee.id);
                    return;
                  }
                  hardDeleteMutation.mutate(deleteState.employee.id);
                }}
              >
                {deleteState.mode === 'soft' ? 'Usuń z listy' : 'Usuń na stałe'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
