import * as React from 'react';
import { cn } from '@/shared/utils/cn';
import { Scissors } from 'lucide-react';

export interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundVariant?: 'user' | 'owner' | 'default';
}

export function AuthLayout({
  children,
  backgroundVariant = 'default',
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500',
        backgroundVariant === 'owner' ? 'bg-foreground/5' : 'bg-background',
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            'absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-20 transition-all duration-500',
            backgroundVariant === 'owner' ? 'bg-primary/30' : 'bg-primary/10',
          )}
        />
        <div
          className={cn(
            'absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-20 transition-all duration-500',
            backgroundVariant === 'owner'
              ? 'bg-muted-foreground/20'
              : 'bg-muted/30',
          )}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
          <Scissors className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold tracking-tight">Hairsy</span>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">{children}</div>

      {/* Footer */}
      <p className="relative z-10 mt-8 text-xs text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} Hairsy. Wszelkie prawa zastrzeżone.
      </p>
    </div>
  );
}
