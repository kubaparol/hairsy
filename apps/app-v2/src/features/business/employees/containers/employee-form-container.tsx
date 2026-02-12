import { useCreateEmployeeMutation } from '../../../../services/employees/mutations/use-create-employee-mutation';
import { useUpdateEmployeeMutation } from '../../../../services/employees/mutations/use-update-employee-mutation';
import type { Employee } from '../../../../services/employees/types';
import type {
  EmployeeFormInitialValues,
  EmployeeFormValues,
} from '../components/employee-form';
import { EmployeeFormModal } from '../components/employee-form-modal';

interface EmployeeFormContainerProps {
  mode: 'create' | 'edit' | null;
  selectedEmployee: Employee | null;
  onClose: () => void;
}

export function EmployeeFormContainer({
  mode,
  selectedEmployee,
  onClose,
}: EmployeeFormContainerProps) {
  const createMutation = useCreateEmployeeMutation({
    onSuccess: onClose,
  });

  const updateMutation = useUpdateEmployeeMutation({
    onSuccess: onClose,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (values: EmployeeFormValues) => {
    if (mode === 'create') {
      createMutation.mutate(values);
      return;
    }

    if (mode === 'edit' && selectedEmployee) {
      updateMutation.mutate({
        id: selectedEmployee.id,
        ...values,
      });
    }
  };

  if (!mode) {
    return null;
  }

  const initialValues: EmployeeFormInitialValues | undefined = selectedEmployee
    ? {
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        bio: selectedEmployee.bio,
        avatarUrl: selectedEmployee.avatarUrl,
        phoneNumber: selectedEmployee.phoneNumber,
        email: selectedEmployee.email,
      }
    : undefined;

  return (
    <EmployeeFormModal
      mode={mode}
      isOpen
      isPending={isPending}
      employeeName={selectedEmployee?.fullName}
      initialValues={initialValues}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}
