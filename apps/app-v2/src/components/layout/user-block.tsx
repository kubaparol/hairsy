import { Avatar } from '@heroui/react';

export interface UserBlockProps {
  name: string;
  email: string;
}

export function UserBlock({ name, email }: UserBlockProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="flex items-center gap-3 rounded-lg py-2.5"
      role="region"
      aria-label="Informacje o zalogowanym użytkowniku"
    >
      <Avatar className="size-10 shrink-0 ring-2 ring-accent-soft-hover">
        <Avatar.Fallback className="bg-accent text-accent-foreground text-sm font-semibold">
          {initials}
        </Avatar.Fallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground leading-tight">
          {name}
        </p>
        <p className="truncate text-xs text-muted leading-tight mt-0.5">
          {email}
        </p>
      </div>
    </div>
  );
}
