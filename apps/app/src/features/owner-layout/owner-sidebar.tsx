import { Link, useRouterState } from '@tanstack/react-router';
import { Calendar, Scissors } from 'lucide-react';
import { useSession } from '@/entities/auth';
import { useSalonByOwner, useSalonCompleteness } from '@/entities/salon';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/ui/components/alert';
import { Button } from '@/shared/ui/components/button';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/components/sidebar';

const navItems = [
  { to: '/app', label: 'Kalendarz', icon: Calendar },
  { to: '/owner/services', label: 'Usługi', icon: Scissors },
  // { to: '/owner/settings', label: 'Ustawienia salonu', icon: Settings },
  // { to: '/account', label: 'Profil / Konto', icon: User },
] as const;

/**
 * Sidebar OWNER – główna nawigacja w panelu właściciela.
 * Pozycje: Kalendarz, Usługi, Ustawienia salonu, Profil/Konto.
 * Alert gdy salon niekompletny z linkiem do onboardingu.
 */
export function OwnerSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: session } = useSession();
  const salon = useSalonByOwner(session?.user?.id);
  const { data: isComplete } = useSalonCompleteness(salon?.data?.id);
  const showIncompleteAlert = salon?.data && isComplete === false;

  return (
    <SidebarContent>
      {showIncompleteAlert && (
        <div className="px-2 py-2">
          <Alert
            variant="default"
            className="border-amber-500/50 bg-amber-500/10"
          >
            <AlertTitle>Dokończ konfigurację salonu</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span className="text-sm">
                Salon nie jest jeszcze kompletny — klienci nie zobaczą go w
                wyszukiwarce.
              </span>
              <Button asChild size="sm" variant="secondary" className="w-fit">
                <Link to="/owner/onboarding">Przejdź do onboardingu</Link>
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive =
                pathname === to || (to !== '/app' && pathname.startsWith(to));
              return (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link to={to}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
