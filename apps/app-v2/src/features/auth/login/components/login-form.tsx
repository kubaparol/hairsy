import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  FieldError,
  Fieldset,
  Input,
  Label,
  TextField,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail jest wymagany')
    .email('Podaj poprawny adres e-mail'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isPending?: boolean;
}

export const LoginForm = ({ onSubmit, isPending }: LoginFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const pending = isPending ?? isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Formularz logowania"
      noValidate
    >
      <Fieldset>
        <Fieldset.Legend className="sr-only">Dane logowania</Fieldset.Legend>

        <Fieldset.Group className="space-y-5">
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
                <Label htmlFor="login-email" isRequired>
                  Adres e-mail
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="jan@example.com"
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby="login-email-error"
                  {...field}
                />
                {error && (
                  <FieldError id="login-email-error">
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
                <Label htmlFor="login-password" isRequired>
                  Hasło
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-describedby="login-password-error"
                  {...field}
                />
                {error && (
                  <FieldError id="login-password-error">
                    {error.message}
                  </FieldError>
                )}
              </TextField>
            )}
          />
        </Fieldset.Group>

        {/* Submit */}
        <Fieldset.Actions className="pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isPending={pending}
          >
            {pending ? 'Logowanie...' : 'Zaloguj się'}
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </form>
  );
};
