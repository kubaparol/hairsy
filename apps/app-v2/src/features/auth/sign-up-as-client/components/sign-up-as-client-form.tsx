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
const MAX_FIRST_NAME_LENGTH = 50;
const MAX_LAST_NAME_LENGTH = 50;

// Polish phone number regex - accepts formats like:
// +48 123 456 789, +48123456789, 48 123 456 789, 123 456 789, 123456789
const POLISH_PHONE_REGEX = /^(\+48)?[\s-]?(\d{3})[\s-]?(\d{3})[\s-]?(\d{3})$/;

const signUpAsClientFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Imię jest wymagane')
    .trim()
    .max(
      MAX_FIRST_NAME_LENGTH,
      `Imię może mieć maksymalnie ${MAX_FIRST_NAME_LENGTH} znaków`,
    )
    .refine((val) => val.trim().length > 0, 'Imię jest wymagane'),
  lastName: z
    .string()
    .min(1, 'Nazwisko jest wymagane')
    .trim()
    .max(
      MAX_LAST_NAME_LENGTH,
      `Nazwisko może mieć maksymalnie ${MAX_LAST_NAME_LENGTH} znaków`,
    )
    .refine((val) => val.trim().length > 0, 'Nazwisko jest wymagane'),
  phoneNumber: z
    .string()
    .min(1, 'Numer telefonu jest wymagany')
    .trim()
    .regex(
      POLISH_PHONE_REGEX,
      'Podaj poprawny polski numer telefonu (np. +48 123 456 789 lub 123456789)',
    ),
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

export type SignUpAsClientFormValues = z.infer<typeof signUpAsClientFormSchema>;

interface SignUpAsClientFormProps {
  isPending?: boolean;
  onSubmit: (data: SignUpAsClientFormValues) => void;
}

export const SignUpAsClientForm = ({
  isPending,
  onSubmit,
}: SignUpAsClientFormProps) => {
  const { control, handleSubmit } = useForm<SignUpAsClientFormValues>({
    resolver: zodResolver(signUpAsClientFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      gdprAccepted: false,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Formularz rejestracji klienta"
      noValidate
    >
      <Fieldset>
        <Fieldset.Legend className="sr-only">
          Dane rejestracyjne klienta
        </Fieldset.Legend>

        <Fieldset.Group className="space-y-5">
          {/* First Name */}
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
                <Label htmlFor="client-firstName" isRequired>
                  Imię
                </Label>
                <Input
                  id="client-firstName"
                  type="text"
                  placeholder="np. Anna"
                  autoComplete="given-name"
                  maxLength={MAX_FIRST_NAME_LENGTH}
                  aria-describedby="client-firstName-description client-firstName-error"
                  {...field}
                />
                <Description id="client-firstName-description">
                  Tak będziemy się do Ciebie zwracać
                </Description>
                {error && (
                  <FieldError id="client-firstName-error">
                    {error.message}
                  </FieldError>
                )}
              </TextField>
            )}
          />

          {/* Last Name */}
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
                <Label htmlFor="client-lastName" isRequired>
                  Nazwisko
                </Label>
                <Input
                  id="client-lastName"
                  type="text"
                  placeholder="np. Kowalska"
                  autoComplete="family-name"
                  maxLength={MAX_LAST_NAME_LENGTH}
                  aria-describedby="client-lastName-error"
                  {...field}
                />
                {error && (
                  <FieldError id="client-lastName-error">
                    {error.message}
                  </FieldError>
                )}
              </TextField>
            )}
          />

          {/* Phone Number */}
          <Controller
            control={control}
            name="phoneNumber"
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
                <Label htmlFor="client-phoneNumber" isRequired>
                  Numer telefonu
                </Label>
                <Input
                  id="client-phoneNumber"
                  type="tel"
                  placeholder="+48 123 456 789"
                  autoComplete="tel"
                  inputMode="tel"
                  aria-describedby="client-phoneNumber-description client-phoneNumber-error"
                  {...field}
                />
                <Description id="client-phoneNumber-description">
                  Salon może się z Tobą skontaktować w sprawie rezerwacji
                </Description>
                {error && (
                  <FieldError id="client-phoneNumber-error">
                    {error.message}
                  </FieldError>
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
                <Label htmlFor="client-email" isRequired>
                  Adres e-mail
                </Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="anna@example.com"
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby="client-email-description client-email-error"
                  {...field}
                />
                <Description id="client-email-description">
                  Użyjemy go do logowania i potwierdzeń wizyty
                </Description>
                {error && (
                  <FieldError id="client-email-error">
                    {error.message}
                  </FieldError>
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
                <Label htmlFor="client-password" isRequired>
                  Hasło
                </Label>
                <Input
                  id="client-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-describedby="client-password-description client-password-error"
                  {...field}
                />
                <Description id="client-password-description">
                  Minimum {MIN_PASSWORD_LENGTH} znaków
                </Description>
                {error && (
                  <FieldError id="client-password-error">
                    {error.message}
                  </FieldError>
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
            {isPending ? 'Rejestruję...' : 'Zarejestruj się'}
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </form>
  );
};
