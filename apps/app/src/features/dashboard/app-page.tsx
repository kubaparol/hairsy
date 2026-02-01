import { useUserRole } from '@/entities/profile';
import { OwnerLayout } from '@/features/owner-layout';

/**
 * App dashboard page after login.
 * - OWNER: panel z sidebarem (Kalendarz, Usługi, Ustawienia, Konto).
 * - USER: placeholder for client panel.
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
    <div className="flex min-h-svh flex-col gap-4 p-4">
      <div className="text-muted-foreground">
        <h1 className="text-2xl font-semibold text-foreground">
          Panel klienta
        </h1>
        <p className="mt-1">Twoje wizyty i rezerwacje.</p>
      </div>
    </div>
  );
}
