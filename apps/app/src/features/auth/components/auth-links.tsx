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
      <p className="text-muted-foreground mt-6 text-center text-sm">
        Nie masz konta?{' '}
        <Link
          to="/sign-up"
          className="text-primary hover:underline font-medium"
        >
          Zarejestruj się
        </Link>
      </p>
    );
  }

  return (
    <p className="text-muted-foreground mt-6 text-center text-sm">
      Masz już konto?{' '}
      <Link
        to="/sign-in"
        className="text-primary hover:underline font-medium"
        search={{
          redirect: undefined,
        }}
      >
        Zaloguj się
      </Link>
    </p>
  );
}
