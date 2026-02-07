import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Description,
  FieldError,
  Fieldset,
  Input,
  Label,
  TextField,
} from '@heroui/react';
import { Link } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;
const MAX_SALON_NAME_LENGTH = 100;

const signUpAsBusinessFormSchema = z.object({
  salonName: z
    .string()
    .min(1, 'Nazwa salonu jest wymagana')
    .trim()
    .max(
      MAX_SALON_NAME_LENGTH,
      `Nazwa może mieć maksymalnie ${MAX_SALON_NAME_LENGTH} znaków`,
    )
    .refine((val) => val.trim().length > 0, 'Nazwa salonu jest wymagana'),
  email: z
    .string()
    .min(1, 'E-mail jest wymagany')
    .email('Podaj poprawny adres e-mail')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Hasło jest wymagane')
    .min(
      MIN_PASSWORD_LENGTH,
      `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków`,
    ),
  gdprAccepted: z
    .boolean()
    .refine((val) => val === true, 'Musisz zaakceptować regulamin'),
});

export type SignUpAsBusinessFormValues = z.infer<
  typeof signUpAsBusinessFormSchema
>;

interface SignUpAsBusinessFormProps {
  isPending: boolean;
  onSubmit: (data: SignUpAsBusinessFormValues) => void;
}

export const SignUpAsBusinessForm = ({
  isPending,
  onSubmit,
}: SignUpAsBusinessFormProps) => {
  const { control, handleSubmit } = useForm<SignUpAsBusinessFormValues>({
    resolver: zodResolver(signUpAsBusinessFormSchema),
    defaultValues: {
      salonName: '',
      email: '',
      password: '',
      gdprAccepted: false,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Formularz rejestracji salonu"
      noValidate
    >
      <Fieldset>
        <Fieldset.Legend className="sr-only">
          Dane rejestracyjne salonu
        </Fieldset.Legend>

        <Fieldset.Group className="space-y-5">
          {/* Salon Name */}
          <Controller
            control={control}
            name="salonName"
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
                <Label htmlFor="salonName" isRequired>
                  Nazwa Salonu
                </Label>
                <Input
                  id="salonName"
                  type="text"
                  placeholder="np. Salon Urody Anna"
                  autoComplete="organization"
                  maxLength={MAX_SALON_NAME_LENGTH}
                  aria-describedby="salonName-description salonName-error"
                  {...field}
                />
                <Description id="salonName-description">
                  Ta nazwa będzie widoczna dla Twoich klientów
                </Description>
                {error && (
                  <FieldError id="salonName-error">{error.message}</FieldError>
                )}
              </TextField>
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
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
                <Label htmlFor="email" isRequired>
                  Adres e-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="salon@example.com"
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby="email-description email-error"
                  {...field}
                />
                <Description id="email-description">
                  Użyjemy go do logowania i powiadomień
                </Description>
                {error && (
                  <FieldError id="email-error">{error.message}</FieldError>
                )}
              </TextField>
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
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
                <Label htmlFor="password" isRequired>
                  Hasło
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-describedby="password-description password-error"
                  {...field}
                />
                <Description id="password-description">
                  Minimum {MIN_PASSWORD_LENGTH} znaków
                </Description>
                {error && (
                  <FieldError id="password-error">{error.message}</FieldError>
                )}
              </TextField>
            )}
          />

          {/* GDPR Checkbox */}
          <Controller
            control={control}
            name="gdprAccepted"
            render={({
              field: { name, value, onChange, onBlur, ref },
              fieldState: { invalid, error },
            }) => (
              <div className="pt-2">
                <Checkbox
                  ref={ref}
                  name={name}
                  isSelected={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  isInvalid={invalid}
                  isRequired
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content>
                    <Label>
                      Akceptuję{' '}
                      <Link
                        to="/"
                        className="text-accent underline hover:text-accent/80"
                        target="_blank"
                      >
                        regulamin
                      </Link>{' '}
                      i{' '}
                      <Link
                        to="/"
                        className="text-accent underline hover:text-accent/80"
                        target="_blank"
                      >
                        politykę prywatności
                      </Link>
                    </Label>
                    <Description>
                      Wymagane do przetwarzania danych osobowych
                    </Description>
                  </Checkbox.Content>
                </Checkbox>
                {error && (
                  <p className="mt-1 text-sm text-danger" role="alert">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          />
        </Fieldset.Group>

        {/* Submit */}
        <Fieldset.Actions className="pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isPending={isPending}
          >
            {isPending ? 'Rejestruję...' : 'Załóż konto'}
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </form>
  );
};
