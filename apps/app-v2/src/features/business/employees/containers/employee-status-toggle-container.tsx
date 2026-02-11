import { useSetEmployeeStatusMutation } from '../../../../services/employees/mutations/use-set-employee-status-mutation';
import type { Employee } from '../../../../services/employees/types';
import { EmployeeStatusToggle } from '../components/employee-status-toggle';

interface EmployeeStatusToggleContainerProps {
  employee: Employee;
}

export function EmployeeStatusToggleContainer({
  employee,
}: EmployeeStatusToggleContainerProps) {
  const statusMutation = useSetEmployeeStatusMutation();

  const handleConfirm = (emp: Employee) => {
    statusMutation.mutate({
      id: emp.id,
      isActive: !emp.isActive,
    });
  };

  return (
    <EmployeeStatusToggle
      employee={employee}
      isPending={statusMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
