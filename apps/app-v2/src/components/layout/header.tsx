import { Link } from '@tanstack/react-router';
import { Button } from '@heroui/react';
import { Menu } from 'lucide-react';

export interface AppHeaderProps {
  /** Called when hamburger is clicked. */
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header
      className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4 lg:hidden"
      role="banner"
    >
      <Button
        variant="ghost"
        isIconOnly
        className="shrink-0"
        aria-label="Otwórz menu"
        onPress={onMenuClick}
      >
        <Menu className="size-5" aria-hidden />
      </Button>
      <Link
        to="/"
        className="text-lg font-semibold text-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Hairsy
      </Link>
    </header>
  );
}
