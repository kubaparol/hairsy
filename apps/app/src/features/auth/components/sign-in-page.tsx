import { useSearch } from '@tanstack/react-router';
import { AuthLayout } from './auth-layout';
import { SignInForm } from './sign-in-form';
import { AuthLinks } from './auth-links';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/components/card';

/**
 * Sign-in page component.
 * Includes login form and link to sign-up page.
 */
export function SignInPage() {
  const search = useSearch({ strict: false });
  const redirectPath = (search as { redirect?: string })?.redirect;

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Zaloguj się</CardTitle>
          <CardDescription>
            Wprowadź swoje dane aby uzyskać dostęp do konta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <SignInForm redirectPath={redirectPath} />
          <AuthLinks variant="sign-in" />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
