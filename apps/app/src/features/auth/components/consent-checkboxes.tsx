import { Checkbox } from '@/shared/ui/components/checkbox';
import type { ConsentItem } from '@/entities/consent';

export interface ConsentCheckboxesProps {
  items: ConsentItem[];
  value: string[];
  onChange: (selectedIds: string[]) => void;
  error?: string;
}

/**
 * Component for displaying GDPR consent checkboxes during registration.
 * Each checkbox includes a link to the full policy document.
 */
export function ConsentCheckboxes({
  items,
  value,
  onChange,
  error,
}: ConsentCheckboxesProps) {
  const handleToggle = (consentId: string) => {
    const isChecked = value.includes(consentId);
    if (isChecked) {
      onChange(value.filter((id) => id !== consentId));
    } else {
      onChange([...value, consentId]);
    }
  };

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">Wymagane zgody</legend>

      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <Checkbox
            id={item.id}
            checked={value.includes(item.id)}
            onCheckedChange={() => handleToggle(item.id)}
            aria-invalid={!!error}
            aria-describedby={error ? 'consent-error' : undefined}
          />

          <div className="flex-1 space-y-1">
            <label
              htmlFor={item.id}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.label}
              {item.isRequired && (
                <span className="text-destructive ml-1" aria-label="wymagane">
                  *
                </span>
              )}
            </label>

            {item.description && (
              <p className="text-muted-foreground text-xs">
                {item.description}
              </p>
            )}

            {item.linkUrl && (
              <a
                href={item.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-xs"
              >
                Przeczytaj pełny dokument
              </a>
            )}
          </div>
        </div>
      ))}

      {error && (
        <p id="consent-error" className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
