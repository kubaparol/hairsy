import { Link } from '@tanstack/react-router';
import { Calendar, Scissors, BarChart3 } from 'lucide-react';

import { BusinessRegisterForm } from './components/business-register-form';
import { useBusinessRegister } from './hooks/use-business-register';

import type { RegisterFormValues } from './components/business-register-form';
import type { LucideIcon } from 'lucide-react';

/* Static data hoisted outside the component to avoid re-creation on render */
const FEATURES: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Calendar,
    title: 'Rezerwacje 24/7',
    description: 'Klienci umawiają się online, nawet gdy Ty śpisz',
  },
  {
    icon: Scissors,
    title: 'Profesjonalny profil',
    description: 'Twój salon widoczny dla nowych klientów',
  },
  {
    icon: BarChart3,
    title: 'Pełna kontrola',
    description: 'Kalendarz, pracownicy i usługi w jednym miejscu',
  },
];

export const BusinessRegisterView = () => {
  const { register, error } = useBusinessRegister();

  const handleSubmit = async (values: RegisterFormValues) => {
    await register({
      salonName: values.salonName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      gdprAccepted: values.gdprAccepted,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel — Branding & Value Proposition (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between border-r border-border bg-linear-to-b from-accent/8 to-surface p-12">
        <div>
          <Link to="/" className="text-2xl font-semibold text-foreground">
            Hairsy
          </Link>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-foreground">
              Koniec z chaosem
              <br />w kalendarzu
            </h2>
            <p className="text-lg text-muted">
              Rezerwacje online, zarządzanie grafikiem i profesjonalny profil
              salonu — wszystko w jednym miejscu.
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
              Skonfiguruj salon w 5 minut — bez zobowiązań
            </p>
          </header>

          {error && (
            <div
              className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
              role="alert"
            >
              {error}
            </div>
          )}

          <BusinessRegisterForm onSubmit={handleSubmit} />

          {/* Footer links */}
          <footer>
            <p className="text-sm text-muted">
              Masz już konto?{' '}
              <Link
                // @ts-expect-error - /login route will be added
                to="/login"
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
