import * as React from 'react';
import { toast } from 'sonner';
import { useUser } from '@/entities/auth';
import { useSalonByOwner } from '@/entities/salon';
import { OwnerLayout } from '@/features/owner-layout';
import {
  useServicesBySalon,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/entities/service';
import { Button } from '@/shared/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/components/table';
import { Skeleton } from '@/shared/ui/components/skeleton';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/shared/ui/components/empty';
import { ServiceFormDialog } from './components/service-form-dialog';
import { DeleteServiceDialog } from './components/delete-service-dialog';
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from '@/entities/service';
import type { Tables } from '@/core/database.types';

export function ServicesPage() {
  const { data: user } = useUser();
  const { data: salon } = useSalonByOwner(user?.id);
  const { data: services, isLoading } = useServicesBySalon(salon?.id);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingService, setEditingService] =
    React.useState<Tables<'services'> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] =
    React.useState<Tables<'services'> | null>(null);

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService({
    salonId: salon?.id ?? '',
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
      toast.success('Usługa została usunięta');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFormSubmit = async (
    data: CreateServiceInput | UpdateServiceInput,
  ) => {
    if (!salon?.id) return;

    try {
      if (editingService) {
        await updateMutation.mutateAsync({
          serviceId: editingService.id,
          updates: data,
        });
        toast.success('Usługa zaktualizowana');
        setFormOpen(false);
        setEditingService(null);
      } else {
        await createMutation.mutateAsync({
          salonId: salon.id,
          data: data as CreateServiceInput,
        });
        toast.success('Usługa dodana');
        setFormOpen(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Nie udało się zapisać usługi',
      );
      throw error;
    }
  };

  const handleEdit = (service: Tables<'services'>) => {
    setEditingService(service);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setFormOpen(true);
  };

  const handleDeleteClick = (service: Tables<'services'>) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serviceToDelete?.id) {
      deleteMutation.mutate(serviceToDelete.id);
    }
  };

  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <OwnerLayout>
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Usługi</h1>
            <p className="text-muted-foreground">
              Zarządzaj usługami oferowanymi w salonie
            </p>
          </div>
          <Button onClick={handleAdd} size="sm">
            Dodaj usługę
          </Button>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !services?.length ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Brak usług</EmptyTitle>
              <EmptyDescription>
                Dodaj pierwszą usługę, aby klienci mogli rezerwować wizyty.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={handleAdd}>Dodaj usługę</Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa</TableHead>
                  <TableHead className="text-right">Czas</TableHead>
                  <TableHead className="text-right">Cena</TableHead>
                  <TableHead className="w-[120px] text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {service.duration_minutes} min
                    </TableCell>
                    <TableCell className="text-right">
                      {service.price} PLN
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          Edytuj
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(service)}
                        >
                          Usuń
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ServiceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={editingService ? 'edit' : 'create'}
        service={editingService}
        onSubmitSuccess={handleFormSubmit}
        isSubmitting={isFormSubmitting}
      />

      <DeleteServiceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        service={serviceToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </OwnerLayout>
  );
}
