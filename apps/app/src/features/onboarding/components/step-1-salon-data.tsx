import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Button } from '@/shared/ui/components/button';
import { Alert, AlertDescription } from '@/shared/ui/components/alert';
import type { CreateSalonInput } from '@/entities/salon';

const salonDataSchema = z.object({
  name: z.string().min(1, 'Nazwa salonu jest wymagana').max(255),
  description: z.string().max(1000).optional(),
  phone: z
    .string()
    .min(1, 'Telefon jest wymagany')
    .max(20, 'Telefon może mieć maksymalnie 20 znaków')
    .regex(/^[0-9+\-\s()]+$/, 'Nieprawidłowy format telefonu'),
});

export type SalonDataFormValues = z.infer<typeof salonDataSchema>;

export interface Step1SalonDataProps {
  initialValues?: Partial<SalonDataFormValues>;
  onSubmit: (data: CreateSalonInput) => void | Promise<void>;
  onSkip?: () => void;
}

/**
 * Step 1: Basic salon data (name, description, phone)
 */
export function Step1SalonData({
  initialValues,
  onSubmit,
  onSkip,
}: Step1SalonDataProps) {
  const form = useForm<SalonDataFormValues>({
    resolver: zodResolver(salonDataSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      phone: initialValues?.phone ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit({
      name: data.name,
      description: data.description || undefined,
      phone: data.phone,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Alert
          variant="default"
          className="border-amber-500/50 bg-amber-500/10"
        >
          <AlertDescription>
            Bez uzupełnienia nazwy i telefonu salon nie będzie widoczny w
            wyszukiwarce dla klientów. Możesz zapisać dane i wrócić do tego
            kroku później.
          </AlertDescription>
        </Alert>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa salonu *</FormLabel>
              <FormControl>
                <Input placeholder="np. Salon Fryzjerski Anna" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon kontaktowy *</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="np. +48 123 456 789"
                  {...field}
                />
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
              <FormLabel>Opis salonu (opcjonalnie)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Krótki opis salonu..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          {onSkip && (
            <Button
              type="button"
              onClick={onSkip}
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Pomiń ten krok
            </Button>
          )}
          <Button type="submit" className="ml-auto">
            Dalej
          </Button>
        </div>
      </form>
    </Form>
  );
}
