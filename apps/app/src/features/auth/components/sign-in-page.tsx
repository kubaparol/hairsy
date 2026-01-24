import { useSearch } from '@tanstack/react-router';
import { AuthLayout } from './auth-layout';
import { SignInForm } from './sign-in-form';
import { AuthLinks } from './auth-links';

/**
 * Sign-in page component.
 * Includes login form and link to sign-up page.
 */
export function SignInPage() {
  const search = useSearch({ strict: false });
  const redirectPath = (search as { redirect?: string })?.redirect;

  return (
    <AuthLayout backgroundVariant="default">
      <div className="space-y-6">
        {/* Login form */}
        <SignInForm redirectPath={redirectPath} />

        {/* Link to sign-up */}
        <AuthLinks variant="sign-in" />
      </div>
    </AuthLayout>
  );
}
