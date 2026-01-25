import { Link } from '@tanstack/react-router';

export interface AuthLinksProps {
  variant: 'sign-in' | 'sign-up';
}

/**
 * Navigation component for switching between sign-in and sign-up pages.
 */
export function AuthLinks({ variant }: AuthLinksProps) {
  if (variant === 'sign-in') {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Nie masz konta?{' '}
        <Link
          to="/sign-up"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Zarejestruj się
        </Link>
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-muted-foreground">
      Masz już konto?{' '}
      <Link
        to="/sign-in"
        className="font-medium text-primary hover:underline underline-offset-4"
        search={{
          redirect: undefined,
        }}
      >
        Zaloguj się
      </Link>
    </p>
  );
}
