import { Link } from '@tanstack/react-router';
import { useSession } from '@/entities/auth';
import { useUserRole } from '@/entities/profile';
import { useSalonByOwner, useSalonCompleteness } from '@/entities/salon';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/ui/components/alert';
import { Button } from '@/shared/ui/components/button';

/**
 * App dashboard page after login.
 * - OWNER: placeholder with completeness banner (link to onboarding when incomplete).
 * - USER: placeholder for client panel.
 */
export function AppPage() {
  const role = useUserRole();
  const { data: session } = useSession();
  const salon = useSalonByOwner(session?.user?.id);
  const { data: isComplete } = useSalonCompleteness(salon?.data?.id);

  const isOwner = role === 'OWNER';
  const showCompletenessBanner = isOwner && salon && isComplete === false;

  if (role === 'OWNER') {
    return (
      <div className="flex min-h-svh flex-col gap-4 p-4">
        {showCompletenessBanner && (
          <Alert
            variant="default"
            className="border-amber-500/50 bg-amber-500/10"
          >
            <AlertTitle>Dokończ konfigurację salonu</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-2">
              <span>
                Salon nie jest jeszcze kompletny — klienci nie zobaczą go w
                wyszukiwarce. Uzupełnij wymagane dane, aby salon był widoczny.
              </span>
              <Button asChild size="sm" variant="secondary">
                <Link to="/owner/onboarding">Przejdź do onboardingu</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="text-muted-foreground">
          <h1 className="text-2xl font-semibold text-foreground">
            Panel właściciela
          </h1>
          <p className="mt-1">
            Kalendarz, usługi i ustawienia salonu będą dostępne w tym miejscu.
          </p>
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link to="/owner/services">Usługi</Link>
            </Button>
          </div>
        </div>
      </div>
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
