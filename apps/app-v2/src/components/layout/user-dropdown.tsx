import { useNavigate } from '@tanstack/react-router';
import { Dropdown, Avatar, Label, Switch } from '@heroui/react';
import { ChevronUp, LogOut, Moon, Settings, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export interface UserDropdownProps {
  user: { name: string; email: string };
  isCollapsed?: boolean;
  /** Path to settings page (e.g. /business/settings or /client/settings). */
  settingsPath: string;
  /** Path to profile page if different from settings. */
  profilePath?: string;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function UserDropdown({
  user,
  isCollapsed = false,
  settingsPath,
  profilePath,
}: UserDropdownProps) {
  const navigate = useNavigate();
  const profileTo = profilePath ?? settingsPath;

  const handleAction = (key: React.Key) => {
    switch (key) {
      case 'profile':
        navigate({ to: profileTo });
        break;
      case 'settings':
        navigate({ to: settingsPath });
        break;
      case 'logout':
        void supabase.auth.signOut().then(() => {
          navigate({ to: '/auth/sign-in' });
        });
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown>
      <Dropdown.Trigger className="w-full">
        <span
          className={cn(
            'flex w-full items-center gap-3 rounded-lg p-2 transition-colors duration-150 hover:bg-default/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            isCollapsed && 'justify-center',
          )}
          aria-label="Menu użytkownika"
        >
          <Avatar className="size-9 shrink-0">
            <Avatar.Fallback className="bg-accent text-accent-foreground text-sm font-semibold">
              {getInitials(user.name)}
            </Avatar.Fallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.name}
                </p>
              </div>
              <ChevronUp className="size-4 shrink-0 text-muted" aria-hidden />
            </>
          )}
        </span>
      </Dropdown.Trigger>
      <Dropdown.Popover placement={isCollapsed ? 'right' : 'top'}>
        <Dropdown.Menu aria-label="Menu użytkownika" onAction={handleAction}>
          <Dropdown.Section aria-label="Konto">
            <Dropdown.Item id="email" textValue={user.email} isDisabled>
              <span className="text-xs text-muted">{user.email}</span>
            </Dropdown.Item>
          </Dropdown.Section>
          <Dropdown.Section aria-label="Akcje">
            <Dropdown.Item id="profile" textValue="Profil">
              <User className="size-4 shrink-0" aria-hidden />
              <Label>Profil</Label>
            </Dropdown.Item>
            <Dropdown.Item id="settings" textValue="Ustawienia">
              <Settings className="size-4 shrink-0" aria-hidden />
              <Label>Ustawienia</Label>
            </Dropdown.Item>
          </Dropdown.Section>
          <Dropdown.Section aria-label="Wygląd">
            <Dropdown.Item id="theme" textValue="Ciemny motyw" isDisabled>
              <Moon className="size-4 shrink-0" aria-hidden />
              <Label>Ciemny motyw</Label>
              <Switch size="sm" />
            </Dropdown.Item>
          </Dropdown.Section>
          <Dropdown.Section aria-label="Sesja">
            <Dropdown.Item id="logout" textValue="Wyloguj się" variant="danger">
              <LogOut className="size-4 shrink-0" aria-hidden />
              <Label className="text-danger">Wyloguj się</Label>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
