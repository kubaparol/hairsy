import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/components/form';
import { Input } from '@/shared/ui/components/input';
import { Textarea } from '@/shared/ui/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/components/select';
import { Button } from '@/shared/ui/components/button';
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from '@/entities/service';
import type { Tables } from '@/core/database.types';

const DURATION_OPTIONS = [
  15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
] as const;

const serviceFormSchema = z.object({
  name: z.string().min(1, 'Nazwa usługi jest wymagana').max(255),
  description: z.string().max(1000).optional(),
  duration_minutes: z
    .number()
    .min(15)
    .max(240)
    .refine((val) => val % 15 === 0, {
      message: 'Czas trwania musi być wielokrotnością 15 minut',
    }),
  price: z
    .number()
    .min(1, 'Cena musi być większa od 0')
    .max(10000, 'Cena nie może przekraczać 10000 PLN')
    .int('Cena musi być liczbą całkowitą'),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  service?: Tables<'services'> | null;
  onSubmitSuccess: (data: CreateServiceInput | UpdateServiceInput) => void;
  isSubmitting?: boolean;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  mode,
  service,
  onSubmitSuccess,
  isSubmitting = false,
}: ServiceFormDialogProps) {
  const form = useForm<ServiceFormValues>({
    // @ts-expect-error www
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: service?.name ?? '',
      description: service?.description ?? '',
      duration_minutes: service?.duration_minutes ?? 30,
      price: service?.price ?? 50,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: service?.name ?? '',
        description: service?.description ?? '',
        duration_minutes: service?.duration_minutes ?? 30,
        price: service?.price ?? 50,
      });
    }
  }, [open, service, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSubmitSuccess({
      name: data.name,
      description: data.description || undefined,
      duration_minutes: data.duration_minutes,
      price: data.price,
    });
  });

  const title = mode === 'create' ? 'Dodaj usługę' : 'Edytuj usługę';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa usługi *</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Strzyżenie męskie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis (opcjonalnie)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Krótki opis usługi..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Czas trwania (min) *</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DURATION_OPTIONS.map((duration) => (
                          <SelectItem
                            key={duration}
                            value={duration.toString()}
                          >
                            {duration} min
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cena (PLN) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10000}
                        step={1}
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Anuluj
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Zapisywanie…'
                  : mode === 'create'
                    ? 'Dodaj'
                    : 'Zapisz'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
