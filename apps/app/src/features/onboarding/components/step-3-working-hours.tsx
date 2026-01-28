import { useForm, useWatch } from 'react-hook-form';
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
import { Switch } from '@/shared/ui/components/switch';
import { Button } from '@/shared/ui/components/button';
import type { WorkingHoursInput } from '@/entities/working-hours';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Niedziela' },
  { value: 1, label: 'Poniedziałek' },
  { value: 2, label: 'Wtorek' },
  { value: 3, label: 'Środa' },
  { value: 4, label: 'Czwartek' },
  { value: 5, label: 'Piątek' },
  { value: 6, label: 'Sobota' },
] as const;

const workingHoursSchema = z.object({
  days: z.array(
    z.object({
      day_of_week: z.number().min(0).max(6),
      isOpen: z.boolean(),
      open_time: z.string().optional(),
      close_time: z.string().optional(),
    }),
  ),
});

export type WorkingHoursFormValues = z.infer<typeof workingHoursSchema>;

export interface Step3WorkingHoursProps {
  initialValues?: WorkingHoursInput[];
  onSubmit: (data: WorkingHoursInput[]) => void | Promise<void>;
  onBack: () => void;
  onSkip?: () => void;
}

/**
 * Step 3: Working hours for each day of the week
 */
export function Step3WorkingHours({
  initialValues,
  onSubmit,
  onBack,
  onSkip,
}: Step3WorkingHoursProps) {
  // Initialize form with existing data or defaults
  const defaultDays = DAYS_OF_WEEK.map((day) => {
    const existing = initialValues?.find((h) => h.day_of_week === day.value);
    return {
      day_of_week: day.value,
      isOpen: !!existing,
      open_time: existing?.open_time?.slice(0, 5) ?? '09:00',
      close_time: existing?.close_time?.slice(0, 5) ?? '17:00',
    };
  });

  const form = useForm<WorkingHoursFormValues>({
    resolver: zodResolver(workingHoursSchema),
    defaultValues: {
      days: defaultDays,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const workingHours: WorkingHoursInput[] = data.days
      .filter((day) => day.isOpen && day.open_time && day.close_time)
      .map((day) => ({
        day_of_week: day.day_of_week,
        open_time: `${day.open_time}:00`,
        close_time: `${day.close_time}:00`,
      }));

    await onSubmit(workingHours);
  });

  const copyToWeekdays = () => {
    const monday = form.getValues('days.1');
    if (monday.isOpen && monday.open_time && monday.close_time) {
      // Copy to Tuesday-Friday (indices 2-5)
      for (let i = 2; i <= 5; i++) {
        form.setValue(`days.${i}.isOpen`, true);
        form.setValue(`days.${i}.open_time`, monday.open_time);
        form.setValue(`days.${i}.close_time`, monday.close_time);
      }
    }
  };

  // Watch all isOpen values at component level
  const watchedDays = useWatch({
    control: form.control,
    name: 'days',
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day, index) => {
            const isOpen = watchedDays?.[index]?.isOpen ?? false;

            return (
              <div
                key={day.value}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`days.${index}.isOpen`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="mt-0! min-w-[120px] font-medium">
                          {day.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {isOpen && (
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`days.${index}.open_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} className="w-32" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <span className="text-muted-foreground">-</span>
                    <FormField
                      control={form.control}
                      name={`days.${index}.close_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} className="w-32" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={copyToWeekdays}
            className="text-sm"
          >
            Skopiuj poniedziałek do dni roboczych
          </Button>
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
