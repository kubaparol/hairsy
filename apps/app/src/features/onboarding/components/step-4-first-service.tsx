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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/components/select';
import { Button } from '@/shared/ui/components/button';
import type { CreateServiceInput } from '@/entities/service';

const DURATION_OPTIONS = [
  15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
] as const;

const firstServiceSchema = z.object({
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

export type FirstServiceFormValues = z.infer<typeof firstServiceSchema>;

export interface Step4FirstServiceProps {
  onSubmit: (data: CreateServiceInput) => void | Promise<void>;
  onBack: () => void;
}

/**
 * Step 4: Add first service
 */
export function Step4FirstService({
  onSubmit,
  onBack,
}: Step4FirstServiceProps) {
  const form = useForm<FirstServiceFormValues>({
    resolver: zodResolver(firstServiceSchema),
    defaultValues: {
      name: '',
      description: '',
      duration_minutes: 30,
      price: 50,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit({
      name: data.name,
      description: data.description || undefined,
      duration_minutes: data.duration_minutes,
      price: data.price,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              <FormLabel>Opis usługi (opcjonalnie)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Krótki opis usługi..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Czas trwania (minuty) *</FormLabel>
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
                      <SelectItem key={duration} value={duration.toString()}>
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
                    placeholder="50"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
          <Button type="submit">Zakończ</Button>
        </div>
      </form>
    </Form>
  );
}
