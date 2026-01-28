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
import { Button } from '@/shared/ui/components/button';
import type { CreateSalonInput } from '@/entities/salon';

const addressSchema = z.object({
  street: z.string().min(1, 'Ulica jest wymagana').max(255),
  street_number: z.string().min(1, 'Numer budynku jest wymagany').max(20),
  postal_code: z
    .string()
    .min(1, 'Kod pocztowy jest wymagany')
    .max(10)
    .regex(/^\d{2}-\d{3}$/, 'Kod pocztowy musi być w formacie XX-XXX'),
  city: z.string().min(1, 'Miasto jest wymagane').max(100),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export interface Step2AddressProps {
  initialValues?: Partial<AddressFormValues>;
  onSubmit: (data: Partial<CreateSalonInput>) => void | Promise<void>;
  onBack: () => void;
  onSkip?: () => void;
}

/**
 * Step 2: Salon address
 */
export function Step2Address({
  initialValues,
  onSubmit,
  onBack,
  onSkip,
}: Step2AddressProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: initialValues?.street ?? '',
      street_number: initialValues?.street_number ?? '',
      postal_code: initialValues?.postal_code ?? '',
      city: initialValues?.city ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit({
      street: data.street,
      street_number: data.street_number,
      postal_code: data.postal_code,
      city: data.city,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Ulica *</FormLabel>
                <FormControl>
                  <Input placeholder="np. ul. Główna" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer *</FormLabel>
                <FormControl>
                  <Input placeholder="np. 15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kod pocztowy *</FormLabel>
                <FormControl>
                  <Input placeholder="00-000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Miasto *</FormLabel>
                <FormControl>
                  <Input placeholder="np. Warszawa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" onClick={onBack} variant="outline">
            Wstecz
          </Button>
          <div className="flex gap-2">
            {onSkip && (
              <Button
                type="button"
                onClick={onSkip}
                variant="ghost"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Pomiń
              </Button>
            )}
            <Button type="submit">Dalej</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
