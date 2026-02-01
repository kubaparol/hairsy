import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { useSignOut } from '@/entities/auth';
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/ui/components/sidebar';
import { OwnerSidebar } from './owner-sidebar';

interface OwnerLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout panelu właściciela z nawigacją boczną.
 * Desktop: collapsible sidebar (Shadcn Sidebar).
 * Mobile: drawer (Sheet).
 */
export function OwnerLayout({ children }: OwnerLayoutProps) {
  const navigate = useNavigate();
  const { mutate: signOut, isPending } = useSignOut({
    onSuccess: () =>
      navigate({ to: '/sign-in', search: { redirect: undefined } }),
  });

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border py-4 px-2">
          <span className="text-sidebar-foreground truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
            Panel właściciela
          </span>
        </SidebarHeader>
        <OwnerSidebar />
        <SidebarFooter className="border-t border-sidebar-border p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                tooltip="Wyloguj"
                onClick={() => signOut()}
                disabled={isPending}
              >
                <LogOut className="size-4" />
                <span>Wyloguj</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
