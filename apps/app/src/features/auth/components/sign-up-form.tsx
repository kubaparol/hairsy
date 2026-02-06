import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { useSignUp } from '@/entities/auth';
import { REQUIRED_CONSENTS } from '@/entities/consent';
import type { UserRole } from './role-switcher';
import { ConsentCheckboxes } from './consent-checkboxes';

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
import { Spinner } from '@/shared/ui/components/spinner';
import { PasswordInput } from '@/shared/ui/components/password-input';

// Zod validation schema for sign-up form
const signUpSchema = z
  .object({
    email: z
      .email('Nieprawidłowy format email')
      .min(1, 'Email jest wymagany')
      .max(255, 'Email może mieć maksymalnie 255 znaków'),
    password: z
      .string()
      .min(8, 'Hasło musi mieć co najmniej 8 znaków')
      .regex(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną wielką literę')
      .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
      .regex(
        /[^A-Za-z0-9]/,
        'Hasło musi zawierać co najmniej jeden znak specjalny',
      ),
    confirmPassword: z.string().min(1, 'Potwierdzenie hasła jest wymagane'),
    firstName: z
      .string()
      .min(1, 'Imię jest wymagane')
      .max(100, 'Imię może mieć maksymalnie 100 znaków')
      .regex(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/,
        'Imię zawiera niedozwolone znaki',
      ),
    role: z.enum(['USER', 'OWNER']),
    consents: z.array(z.string()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła muszą być identyczne',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      // Check if all required consents are accepted
      const requiredConsentIds = REQUIRED_CONSENTS.filter(
        (c) => c.isRequired,
      ).map((c) => c.id);
      return requiredConsentIds.every((id) => data.consents.includes(id));
    },
    {
      message: 'Musisz zaakceptować wszystkie wymagane zgody',
      path: ['consents'],
    },
  );

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export interface SignUpFormProps {
  role: UserRole;
  onSuccess?: () => void;
}

/**
 * Sign-up form component with email, password, name, and GDPR consents.
 * Includes inline validation and server error handling.
 */
export function SignUpForm({ role, onSuccess }: SignUpFormProps) {
  const navigate = useNavigate();
  const {
    mutate: register,
    isPending,
    error,
  } = useSignUp({
    onSuccess: () => {
      toast.success('Sprawdź email aby potwierdzić konto');
      onSuccess?.();
      navigate({ to: '/sign-in', search: { redirect: undefined } });
    },
  });

  const form = useForm<SignUpFormValues>({
    // @ts-expect-error asdas
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      role: role,
      consents: [],
    },
    mode: 'onBlur',
  });

  // Sync role with form when it changes from parent
  React.useEffect(() => {
    form.setValue('role', role);
  }, [role, form]);

  const handleSubmit = form.handleSubmit((data) => {
    // Map consent IDs to policy versions
    const policyVersions = data.consents
      .map((consentId) => {
        const consent = REQUIRED_CONSENTS.find((c) => c.id === consentId);
        return consent?.policyVersion;
      })
      .filter(Boolean) as string[];

    register({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      role: data.role,
      consents: policyVersions,
    });
  });

  // Handle server errors and focus management
  React.useEffect(() => {
    if (error) {
      // Set field-specific errors based on error code
      if (error.code === 'USER_ALREADY_EXISTS') {
        form.setError('email', {
          type: 'manual',
          message: error.message,
        });
        form.setFocus('email');
      } else if (error.code === 'WEAK_PASSWORD') {
        form.setError('password', {
          type: 'manual',
          message: error.message,
        });
        form.setFocus('password');
      } else {
        // Show generic error as toast
        toast.error(error.message);
      }
    }
  }, [error, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="twoj@email.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First name field */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Jan"
                  autoComplete="given-name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm password field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potwierdź hasło</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Consents checkboxes */}
        <FormField
          control={form.control}
          name="consents"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ConsentCheckboxes
                  items={REQUIRED_CONSENTS}
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.consents?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <Spinner className="mr-2" />
              Rejestrowanie...
            </>
          ) : (
            'Zarejestruj się'
          )}
        </Button>
      </form>
    </Form>
  );
}
