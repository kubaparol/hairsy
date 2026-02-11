import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  FieldError,
  Fieldset,
  Input,
  Label,
  TextField,
} from '@heroui/react';

const employeeFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Imię jest wymagane')
    .max(80, 'Imię może mieć maksymalnie 80 znaków'),
  lastName: z
    .string()
    .min(1, 'Nazwisko jest wymagane')
    .max(80, 'Nazwisko może mieć maksymalnie 80 znaków'),
  email: z
    .union([
      z.string().trim().length(0),
      z.string().trim().email('Podaj poprawny adres e-mail'),
    ])
    .optional(),
  phoneNumber: z
    .union([
      z.string().trim().length(0),
      z
        .string()
        .trim()
        .min(6, 'Numer telefonu jest za krótki')
        .max(32, 'Numer telefonu jest za długi'),
    ])
    .optional(),
  avatarUrl: z
    .union([
      z.string().trim().length(0),
      z.string().trim().url('Podaj poprawny URL'),
    ])
    .optional(),
  bio: z
    .union([
      z.string().trim().length(0),
      z.string().trim().max(500, 'Bio może mieć maksymalnie 500 znaków'),
    ])
    .optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export interface EmployeeFormInitialValues {
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}

interface EmployeeFormProps {
  mode: 'create' | 'edit';
  isPending?: boolean;
  initialValues?: EmployeeFormInitialValues;
  onCancel: () => void;
  onSubmit: (values: EmployeeFormValues) => void;
}

const defaultValues: EmployeeFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  avatarUrl: '',
  bio: '',
};

function toFormValues(
  initialValues?: EmployeeFormInitialValues,
): EmployeeFormValues {
  if (!initialValues) {
    return defaultValues;
  }

  return {
    firstName: initialValues.firstName ?? '',
    lastName: initialValues.lastName ?? '',
    email: initialValues.email ?? '',
    phoneNumber: initialValues.phoneNumber ?? '',
    avatarUrl: initialValues.avatarUrl ?? '',
    bio: initialValues.bio ?? '',
  };
}

export function EmployeeForm({
  mode,
  isPending,
  initialValues,
  onCancel,
  onSubmit,
}: EmployeeFormProps) {
  const { control, handleSubmit } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: toFormValues(initialValues),
  });

  const submitLabel = mode === 'create' ? 'Dodaj pracownika' : 'Zapisz zmiany';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formularz pracownika"
    >
      <Fieldset>
        <Fieldset.Group className="grid gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="firstName"
            render={({
              field: { name, ...field },
              fieldState: { invalid, error },
            }) => (
              <TextField
                name={name}
                isRequired
                isInvalid={invalid}
                validationBehavior="aria"
              >
                <Label htmlFor="employee-first-name" isRequired>
                  Imię
                </Label>
                <Input
                  variant="secondary"
                  id="employee-first-name"
                  autoComplete="given-name"
                  placeholder="Np. Anna…"
                  {...field}
                />
                {error ? <FieldError>{error.message}</FieldError> : null}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({
              field: { name, ...field },
              fieldState: { invalid, error },
            }) => (
              <TextField
                name={name}
                isRequired
                isInvalid={invalid}
                validationBehavior="aria"
              >
                <Label htmlFor="employee-last-name" isRequired>
                  Nazwisko
                </Label>
                <Input
                  variant="secondary"
                  id="employee-last-name"
                  autoComplete="family-name"
                  placeholder="Np. Kowalska…"
                  {...field}
                />
                {error ? <FieldError>{error.message}</FieldError> : null}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({
              field: { name, ...field },
              fieldState: { invalid, error },
            }) => (
              <TextField
                name={name}
                isInvalid={invalid}
                validationBehavior="aria"
              >
                <Label htmlFor="employee-email">Adres e-mail</Label>
                <Input
                  variant="secondary"
                  id="employee-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  placeholder="anna@salon.pl…"
                  {...field}
                />
                {error ? <FieldError>{error.message}</FieldError> : null}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({
              field: { name, ...field },
              fieldState: { invalid, error },
            }) => (
              <TextField
                name={name}
                isInvalid={invalid}
                validationBehavior="aria"
              >
                <Label htmlFor="employee-phone">Telefon</Label>
                <Input
                  variant="secondary"
                  id="employee-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+48 600 123 456…"
                  {...field}
                />
                {error ? <FieldError>{error.message}</FieldError> : null}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="avatarUrl"
            render={({
              field: { name, ...field },
              fieldState: { invalid, error },
            }) => (
              <TextField
                name={name}
                isInvalid={invalid}
                validationBehavior="aria"
                className="md:col-span-2"
              >
                <Label htmlFor="employee-avatar-url">Avatar URL</Label>
                <Input
                  variant="secondary"
                  id="employee-avatar-url"
                  type="url"
                  autoComplete="off"
                  inputMode="url"
                  spellCheck={false}
                  placeholder="https://cdn.example.com/avatar.jpg…"
                  {...field}
                />
                {error ? <FieldError>{error.message}</FieldError> : null}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="bio"
            render={({
              field: { name, ...field },
              fieldState: { invalid, error },
            }) => (
              <TextField
                name={name}
                isInvalid={invalid}
                validationBehavior="aria"
                className="md:col-span-2"
              >
                <Label htmlFor="employee-bio">Bio</Label>
                <Input
                  variant="secondary"
                  id="employee-bio"
                  autoComplete="off"
                  placeholder="Krótkie bio pracownika…"
                  {...field}
                />
                {error ? <FieldError>{error.message}</FieldError> : null}
              </TextField>
            )}
          />
        </Fieldset.Group>

        <Fieldset.Actions className="flex gap-3 pt-3">
          <Button type="button" variant="secondary" onPress={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" variant="primary" isPending={isPending}>
            {isPending ? 'Zapisywanie…' : submitLabel}
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </form>
  );
}
