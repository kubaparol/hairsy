import { Button, Modal } from '@heroui/react';
import type { Employee } from '../../../../services/employees/types';

export type DeleteEmployeeMode = 'soft' | 'hard';

interface DeleteEmployeeModalProps {
  employee: Employee;
  mode: DeleteEmployeeMode;
  isOpen: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteEmployeeModal({
  employee,
  mode,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: DeleteEmployeeModalProps) {
  const title =
    mode === 'soft'
      ? 'Usunąć pracownika z aktywnej listy?'
      : 'Trwale usunąć pracownika?';

  const description =
    mode === 'soft'
      ? `Pracownik ${employee.fullName} zostanie dezaktywowany i ukryty na liście.`
      : `Pracownik ${employee.fullName} zostanie bezpowrotnie usunięty.`;

  const confirmLabel = mode === 'soft' ? 'Usuń z listy' : 'Usuń na stałe';

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isPending) {
          onClose();
        }
      }}
    >
      <Modal.Container>
        <Modal.Dialog
          aria-labelledby="delete-employee-title"
          className="sm:max-w-lg"
        >
          <Modal.CloseTrigger isDisabled={isPending} />
          <Modal.Header>
            <Modal.Heading id="delete-employee-title">{title}</Modal.Heading>
            <p className="text-default-600 text-sm pt-2">{description}</p>
          </Modal.Header>
          <Modal.Footer className="flex justify-end gap-3 pt-5">
            <Button variant="secondary" slot="close" isDisabled={isPending}>
              Anuluj
            </Button>
            <Button variant="danger" isPending={isPending} onPress={onConfirm}>
              {confirmLabel}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
