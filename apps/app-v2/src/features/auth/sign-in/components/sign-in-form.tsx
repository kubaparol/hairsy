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

const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail jest wymagany')
    .email('Podaj poprawny adres e-mail'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;

interface SignInFormProps {
  onSubmit: (data: SignInFormValues) => Promise<void>;
  isPending?: boolean;
}

export const SignInForm = ({ onSubmit, isPending }: SignInFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
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
                <Label htmlFor="sign-in-email" isRequired>
                  Adres e-mail
                </Label>
                <Input
                  id="sign-in-email"
                  type="email"
                  placeholder="jan@example.com"
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby="sign-in-email-error"
                  {...field}
                />
                {error && (
                  <FieldError id="sign-in-email-error">
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
                <Label htmlFor="sign-in-password" isRequired>
                  Hasło
                </Label>
                <Input
                  id="sign-in-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-describedby="sign-in-password-error"
                  {...field}
                />
                {error && (
                  <FieldError id="sign-in-password-error">
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
