import { Link, useSearch } from '@tanstack/react-router';
import { Calendar, Store, User } from 'lucide-react';

import { SignInForm } from './components/sign-in-form';
import { useSignInMutation } from '../../../services/auth/mutations/use-sign-in-mutation';

import type { SignInFormValues } from './components/sign-in-form';
import type { LucideIcon } from 'lucide-react';

/* Static data hoisted outside the component to avoid re-creation on render */
const FEATURES: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Calendar,
    title: 'Rezerwacje online',
    description: 'Umów wizytę w ulubionym salonie w kilka minut',
  },
  {
    icon: Store,
    title: 'Dla salonów',
    description: 'Zarządzaj grafikiem i rezerwacjami w jednym miejscu',
  },
  {
    icon: User,
    title: 'Jedno konto',
    description: 'Zaloguj się jako klient lub właściciel salonu',
  },
];

export const SignInView = () => {
  const search = useSearch({ from: '/auth/sign-in' });
  const { mutate: signIn, isPending } = useSignInMutation({
    redirectTo: search.redirect,
  });

  const handleSubmit = (values: SignInFormValues) => {
    signIn({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between border-r border-border bg-linear-to-b from-accent/8 to-surface p-12">
        <div>
          <Link to="/" className="text-2xl font-semibold text-foreground">
            Hairsy
          </Link>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-foreground">
              Zarezerwuj wizytę
              <br />
              lub zarządzaj salonem
            </h2>
            <p className="text-lg text-muted">
              Jedna platforma dla klientów i salonów — loguj się i wybierz swoją
              ścieżkę.
            </p>
          </div>

          <div className="space-y-5">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <feature.icon className="size-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Hairsy. Wszystkie prawa zastrzeżone.
        </p>
      </div>

      {/* Right Panel — Sign-in Form */}
      <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-7/12 lg:px-16">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-only brand header */}
          <div className="mb-2 lg:hidden">
            <Link to="/" className="text-2xl font-semibold text-foreground">
              Hairsy
            </Link>
          </div>

          <header>
            <h1 className="text-3xl font-semibold text-foreground">
              Zaloguj się
            </h1>
            <p className="mt-2 text-sm text-muted">
              Wprowadź dane, aby wejść na swoje konto
            </p>
          </header>

          <SignInForm isPending={isPending} onSubmit={handleSubmit} />

          {/* Footer links — two registration options */}
          <footer className="space-y-1">
            <p className="text-sm text-muted">Nie masz konta?</p>
            <p className="text-sm">
              <Link
                to="/auth/sign-up-as-business"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Załóż salon
              </Link>
              <span className="text-muted"> · </span>
              <Link
                to="/auth/sign-up-as-client"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Zarejestruj się jako klient
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
