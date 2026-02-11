import { Modal } from '@heroui/react';
import {
  EmployeeForm,
  type EmployeeFormInitialValues,
  type EmployeeFormValues,
} from './employee-form';

interface EmployeeFormModalProps {
  mode: 'create' | 'edit';
  isOpen: boolean;
  isPending?: boolean;
  employeeName?: string;
  initialValues?: EmployeeFormInitialValues;
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => void;
}

export function EmployeeFormModal({
  mode,
  isOpen,
  isPending,
  employeeName,
  initialValues,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const title =
    mode === 'create' ? 'Nowy pracownik' : `Edycja: ${employeeName ?? ''}`;

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isPending) {
          onClose();
        }
      }}
    >
      <Modal.Container size="lg">
        <Modal.Dialog aria-label={title}>
          <Modal.CloseTrigger isDisabled={isPending} />
          <Modal.Header className="px-1">
            <Modal.Heading>{title}</Modal.Heading>
            <p className="text-default-500 text-sm">
              Uzupełnij wymagane pola, aby zapisać pracownika.
            </p>
          </Modal.Header>

          <Modal.Body className="py-6 px-1">
            <EmployeeForm
              mode={mode}
              isPending={isPending}
              initialValues={initialValues}
              onCancel={onClose}
              onSubmit={onSubmit}
            />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
