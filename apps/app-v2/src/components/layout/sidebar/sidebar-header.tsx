import { Link } from '@tanstack/react-router';
import { Button } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebarContext } from './sidebar-context';

export function SidebarHeader() {
  const { isCollapsed, toggleCollapsed } = useSidebarContext();

  return (
    <div
      className={cn(
        'flex h-16 shrink-0 items-center border-b border-border transition-[padding] duration-200 ease-out',
        isCollapsed ? 'justify-center px-0' : 'justify-between px-3',
      )}
    >
      {isCollapsed ? (
        <Button
          variant="ghost"
          isIconOnly
          size="sm"
          aria-label="Rozwiń menu"
          className="shrink-0 hidden lg:flex"
          onPress={toggleCollapsed}
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      ) : (
        <>
          <Link
            to="/"
            className="flex min-w-0 flex-1 items-center overflow-hidden text-lg font-semibold text-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="truncate">Hairsy</span>
          </Link>
          <Button
            variant="ghost"
            isIconOnly
            size="sm"
            aria-label="Zwiń menu"
            className="shrink-0 hidden lg:flex"
            onPress={toggleCollapsed}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
        </>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
