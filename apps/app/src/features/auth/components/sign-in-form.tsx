import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { useSignIn } from '@/entities/auth';

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

// Zod validation schema for sign-in form
const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email jest wymagany')
    .email('Nieprawidłowy format email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export interface SignInFormProps {
  redirectPath?: string;
  onSuccess?: () => void;
}

/**
 * Sign-in form component with email and password.
 * Includes inline validation and server error handling.
 */
export function SignInForm({ redirectPath, onSuccess }: SignInFormProps) {
  const navigate = useNavigate();
  const {
    mutate: signIn,
    isPending,
    error,
  } = useSignIn({
    onSuccess: () => {
      toast.success('Zalogowano pomyślnie');
      onSuccess?.();

      // Redirect to specified path or default to /app
      if (redirectPath) {
        navigate({ to: redirectPath });
      } else {
        navigate({ to: '/app' });
      }
    },
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const handleSubmit = form.handleSubmit((data) => {
    signIn({
      email: data.email,
      password: data.password,
    });
  });

  // Handle server errors and focus management
  React.useEffect(() => {
    if (error) {
      // Set inline error for invalid credentials
      if (error.code === 'INVALID_CREDENTIALS') {
        form.setError('root', {
          type: 'manual',
          message: error.message,
        });
        // Focus on email field for retry
        form.setFocus('email');
      } else if (error.code === 'EMAIL_NOT_CONFIRMED') {
        toast.error(error.message);
      } else if (error.code === 'RATE_LIMITED') {
        toast.error(error.message);
      } else {
        // Show generic error as toast
        toast.error(error.message);
      }
    }
  }, [error, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Root error message (e.g., invalid credentials) */}
        {form.formState.errors.root && (
          <div
            className="text-destructive rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm"
            role="alert"
          >
            {form.formState.errors.root.message}
          </div>
        )}

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
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
              Logowanie...
            </>
          ) : (
            'Zaloguj się'
          )}
        </Button>
      </form>
    </Form>
  );
}
