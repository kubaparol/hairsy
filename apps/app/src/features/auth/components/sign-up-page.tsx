import * as React from 'react';
import { AuthLayout } from './auth-layout';
import { RoleSwitcher, type UserRole } from './role-switcher';
import { SignUpForm } from './sign-up-form';
import { AuthLinks } from './auth-links';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/components/card';

/**
 * Sign-up page component.
 * Includes role switcher, registration form, and link to sign-in page.
 */
export function SignUpPage() {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>('USER');

  return (
    <AuthLayout backgroundVariant={selectedRole === 'OWNER' ? 'owner' : 'user'}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Utwórz konto</CardTitle>
          <CardDescription>
            Dołącz do Hairsy i zarządzaj swoimi wizytami
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <RoleSwitcher value={selectedRole} onChange={setSelectedRole} />
          <SignUpForm role={selectedRole} />
          <AuthLinks variant="sign-up" />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
