import { Link } from '@tanstack/react-router';
import { Calendar, Bell, History } from 'lucide-react';

import { SignUpAsClientForm } from './components/sign-up-as-client-form';

import type { SignUpAsClientFormValues } from './components/sign-up-as-client-form';
import type { LucideIcon } from 'lucide-react';
import { useSignUpAsClientMutation } from '../../../services/auth/mutations/use-sign-up-as-client-mutation';

/* Static data hoisted outside the component to avoid re-creation on render */
const FEATURES: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Calendar,
    title: 'Szybka rezerwacja',
    description: 'Wybierz salon, usługę i termin — w trzy kliknięcia',
  },
  {
    icon: Bell,
    title: 'Potwierdzenia',
    description: 'Otrzymuj e-mail z potwierdzeniem każdej rezerwacji',
  },
  {
    icon: History,
    title: 'Historia wizyt',
    description: 'Wszystkie umówione wizyty w jednym miejscu',
  },
];

export const SignUpAsClientView = () => {
  const { mutate: signUp, isPending } = useSignUpAsClientMutation();

  const handleSubmit = (values: SignUpAsClientFormValues) => {
    signUp({
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      password: values.password,
      gdprAccepted: values.gdprAccepted,
      termsVersion: '2026-02-01',
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel — B2C Branding (hidden on mobile) */}
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
              <br />w ulubionym salonie
            </h2>
            <p className="text-lg text-muted">
              Znajdź salon, wybierz usługę i termin — umów się online w kilka
              minut.
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

      {/* Right Panel — Registration Form */}
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
              Utwórz konto
            </h1>
            <p className="mt-2 text-sm text-muted">
              Zarejestruj się, aby umawiać wizyty w salonach
            </p>
          </header>

          <SignUpAsClientForm isPending={isPending} onSubmit={handleSubmit} />

          {/* Footer links */}
          <footer>
            <p className="text-sm text-muted">
              Masz już konto?{' '}
              <Link
                to="/auth/sign-in"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Zaloguj się
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
