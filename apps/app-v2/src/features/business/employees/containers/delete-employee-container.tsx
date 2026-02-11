import { useSoftDeleteEmployeeMutation } from '../../../../services/employees/mutations/use-soft-delete-employee-mutation';
import { useHardDeleteEmployeeMutation } from '../../../../services/employees/mutations/use-hard-delete-employee-mutation';
import type { Employee } from '../../../../services/employees/types';
import {
  DeleteEmployeeModal,
  type DeleteEmployeeMode,
} from '../components/delete-employee-modal';

interface DeleteEmployeeContainerProps {
  employee: Employee | null;
  mode: DeleteEmployeeMode | null;
  onClose: () => void;
}

export function DeleteEmployeeContainer({
  employee,
  mode,
  onClose,
}: DeleteEmployeeContainerProps) {
  const softDeleteMutation = useSoftDeleteEmployeeMutation({
    onSuccess: onClose,
  });

  const hardDeleteMutation = useHardDeleteEmployeeMutation({
    onSuccess: onClose,
  });

  const isPending =
    softDeleteMutation.isPending || hardDeleteMutation.isPending;

  const handleConfirm = () => {
    if (!employee) return;

    if (mode === 'soft') {
      softDeleteMutation.mutate(employee.id);
      return;
    }

    if (mode === 'hard') {
      hardDeleteMutation.mutate(employee.id);
    }
  };

  if (!employee || !mode) {
    return null;
  }

  return (
    <DeleteEmployeeModal
      employee={employee}
      mode={mode}
      isOpen
      isPending={isPending}
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  );
}
