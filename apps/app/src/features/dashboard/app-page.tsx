import { Link } from '@tanstack/react-router';
import { useUserRole } from '@/entities/profile';
import { OwnerLayout } from '@/features/owner-layout';
import { PublicLayout } from '@/features/public-header';
import { Button } from '@/shared/ui/components/button';

/**
 * App dashboard page after login.
 * - OWNER: panel z sidebarem (Kalendarz, Usługi, Ustawienia, Konto).
 * - USER: panel klienta z headerem publicznym.
 */
export function AppPage() {
  const role = useUserRole();

  if (role === 'OWNER') {
    return (
      <OwnerLayout>
        <div className="text-muted-foreground">
          <h1 className="text-2xl font-semibold text-foreground">Kalendarz</h1>
          <p className="mt-1">
            Kalendarz, usługi i ustawienia salonu dostępne w menu bocznym.
          </p>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-svh flex-col gap-4 p-4 md:p-6">
        <div className="text-muted-foreground">
          <h1 className="text-2xl font-semibold text-foreground">
            Panel klienta
          </h1>
          <p className="mt-1">Twoje wizyty i rezerwacje.</p>
        </div>
        <Button asChild variant="secondary" className="w-fit">
          <Link to="/salons" search={{ city: undefined }}>
            Znajdź salon
          </Link>
        </Button>
      </div>
    </PublicLayout>
  );
}
