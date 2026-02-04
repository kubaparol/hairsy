import { PublicHeader } from './public-header';

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout publiczny - dla stref: publicznej (landing, salony) i USER.
 *
 * Struktura:
 * - Header (nawigacja, logo, auth buttons)
 * - Content (main)
 * - Footer (opcjonalnie w przyszłości)
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
