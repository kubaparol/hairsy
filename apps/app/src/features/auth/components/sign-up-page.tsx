import * as React from 'react';
import { AuthLayout } from './auth-layout';
import { RoleSwitcher, type UserRole } from './role-switcher';
import { SignUpForm } from './sign-up-form';
import { AuthLinks } from './auth-links';

/**
 * Sign-up page component.
 * Includes role switcher, registration form, and link to sign-in page.
 */
export function SignUpPage() {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>('USER');

  // Map role to background variant
  const backgroundVariant = selectedRole === 'OWNER' ? 'owner' : 'user';

  return (
    <AuthLayout backgroundVariant={backgroundVariant}>
      <div className="space-y-6">
        {/* Role switcher */}
        <div className="flex justify-center">
          <RoleSwitcher value={selectedRole} onChange={setSelectedRole} />
        </div>

        {/* Registration form */}
        <SignUpForm role={selectedRole} />

        {/* Link to sign-in */}
        <AuthLinks variant="sign-up" />
      </div>
    </AuthLayout>
  );
}
