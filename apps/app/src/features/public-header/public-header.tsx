import { Link } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { useSession } from '@/entities/auth';
import { useProfile } from '@/entities/profile';
import { Button } from '@/shared/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/components/dropdown-menu';
import { Avatar, AvatarFallback } from '@/shared/ui/components/avatar';
import { useSignOut } from '@/entities/auth';

/**
 * Header publiczny - nawigacja w strefie publicznej i USER.
 *
 * Elementy:
 * - Logo (link do `/`)
 * - Nawigacja: Salony, Panel (gdy zalogowany USER/OWNER)
 * - Auth buttons: Login/Register lub Avatar z dropdown
 */
export function PublicHeader() {
  const { data: session } = useSession();
  const { data: profile } = useProfile(session?.user?.id);
  const { mutate: signOut } = useSignOut();
  const isAuthenticated = !!session;

  const getInitials = (firstName?: string | null) => {
    if (!firstName) return 'U';
    return firstName.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold hover:opacity-80 transition-opacity"
        >
          <span className="text-primary">Hairsy</span>
        </Link>

        {/* Nawigacja */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/salons"
            search={{ city: undefined }}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeProps={{
              className:
                'text-sm font-medium text-foreground transition-colors',
            }}
          >
            Salony
          </Link>
          {isAuthenticated && (
            <Link
              to="/app"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{
                className:
                  'text-sm font-medium text-foreground transition-colors',
              }}
            >
              Panel
            </Link>
          )}
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sign-in" search={{ redirect: undefined }}>
                  Zaloguj się
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/sign-up">Zarejestruj się</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(profile?.first_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    {profile?.first_name && (
                      <p className="text-sm font-medium leading-none">
                        {profile.first_name}
                      </p>
                    )}
                    {profile?.email && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Panel
                  </Link>
                </DropdownMenuItem>
                {/* Mobile navigation items */}
                <div className="md:hidden">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/salons"
                      search={{ city: undefined }}
                      className="cursor-pointer"
                    >
                      Salony
                    </Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => signOut()}
                >
                  Wyloguj się
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
