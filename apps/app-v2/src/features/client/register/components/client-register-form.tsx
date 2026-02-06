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

const clientRegisterFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Imię jest wymagane')
    .trim()
    .max(
      MAX_FIRST_NAME_LENGTH,
      `Imię może mieć maksymalnie ${MAX_FIRST_NAME_LENGTH} znaków`,
    )
    .refine((val) => val.trim().length > 0, 'Imię jest wymagane'),
  email: z
    .string()
    .min(1, 'E-mail jest wymagany')
    .email('Podaj poprawny adres e-mail'),
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

export type ClientRegisterFormValues = z.infer<typeof clientRegisterFormSchema>;

interface ClientRegisterFormProps {
  onSubmit: (data: ClientRegisterFormValues) => Promise<void>;
}

export const ClientRegisterForm = ({ onSubmit }: ClientRegisterFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ClientRegisterFormValues>({
    resolver: zodResolver(clientRegisterFormSchema),
    defaultValues: {
      firstName: '',
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
                  Użyjemy go do logowania i potwierdzeń rezerwacji
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
            isPending={isSubmitting}
          >
            {isSubmitting ? 'Rejestruję...' : 'Zarejestruj się'}
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </form>
  );
};
