import { useState } from 'react';
import { Button, Label, Modal, Switch } from '@heroui/react';
import type { Employee } from '../../../../services/employees/types';

interface EmployeeStatusToggleProps {
  employee: Employee;
  isPending?: boolean;
  onConfirm: (employee: Employee) => void;
}

export function EmployeeStatusToggle({
  employee,
  isPending,
  onConfirm,
}: EmployeeStatusToggleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targetActive = !employee.isActive;

  const title = targetActive
    ? `Aktywować pracownika ${employee.fullName}?`
    : `Dezaktywować pracownika ${employee.fullName}?`;

  const description = targetActive
    ? 'Pracownik będzie widoczny na liście i dostępny do przypisywania usług.'
    : 'Pracownik zostanie ukryty z aktywnej listy i nie będzie dostępny do przypisywania usług.';

  const confirmLabel = targetActive ? 'Aktywuj' : 'Dezaktywuj';

  const handleSwitchChange = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    onConfirm(employee);
    setIsModalOpen(false);
  };

  return (
    <>
      <Switch
        aria-label={
          employee.isActive
            ? `Dezaktywuj ${employee.fullName}`
            : `Aktywuj ${employee.fullName}`
        }
        isDisabled={isPending}
        isSelected={employee.isActive}
        onChange={handleSwitchChange}
        size="sm"
      >
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Label className="text-sm">
          {employee.isActive ? 'Aktywny' : 'Nieaktywny'}
        </Label>
      </Switch>

      <Modal.Backdrop
        isOpen={isModalOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setIsModalOpen(false);
        }}
      >
        <Modal.Container>
          <Modal.Dialog
            aria-labelledby="employee-status-confirm-title"
            className="sm:max-w-lg"
          >
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading id="employee-status-confirm-title">
                {title}
              </Modal.Heading>
              <p className="text-default-600 pt-2 text-sm">{description}</p>
            </Modal.Header>
            <Modal.Footer className="flex justify-end gap-3 pt-5">
              <Button variant="secondary" slot="close">
                Anuluj
              </Button>
              <Button
                variant={targetActive ? 'primary' : 'danger'}
                isPending={isPending}
                onPress={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
