import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/components/tabs';

export type UserRole = 'USER' | 'OWNER';

export interface RoleSwitcherProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

/**
 * Role switcher component for selecting user type during registration.
 * Displays two segmented buttons with visual indicator for active selection.
 */
export function RoleSwitcher({
  value,
  onChange,
  disabled = false,
}: RoleSwitcherProps) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as UserRole)}>
      <TabsList
        aria-label="Wybór roli użytkownika"
        className="inline-flex mx-auto"
      >
        <TabsTrigger value="USER" disabled={disabled} className="px-6">
          Klient
        </TabsTrigger>
        <TabsTrigger value="OWNER" disabled={disabled} className="px-6">
          Biznes
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
