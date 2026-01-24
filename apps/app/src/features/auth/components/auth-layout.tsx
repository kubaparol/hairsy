import * as React from 'react';
import { cn } from '@/shared/utils/cn';
import { Card, CardContent } from '@/shared/ui/components/card';

export interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundVariant?: 'user' | 'owner' | 'default';
}

/**
 * Shared layout for authentication pages (sign-in, sign-up).
 * Provides centered content, logo, and animated background based on selected role.
 */
export function AuthLayout({
  children,
  backgroundVariant = 'default',
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {/* Animated background */}
      <div
        className={cn('absolute inset-0 -z-10 transition-all duration-500', {
          'bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20':
            backgroundVariant === 'user',
          'bg-linear-to-br from-violet-50 via-white to-purple-50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20':
            backgroundVariant === 'owner',
          'bg-background': backgroundVariant === 'default',
        })}
      />

      {/* Content container */}
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Hairsy</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Twój salon piękności w kieszeni
          </p>
        </div>

        {/* Auth form card */}
        <Card>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
