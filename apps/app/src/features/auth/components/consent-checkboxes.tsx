import { Checkbox } from '@/shared/ui/components/checkbox';
import { Label } from '@/shared/ui/components/label';
import { FileText } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
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
    <fieldset className="space-y-2">
      <legend className="sr-only">Wymagane zgody</legend>

      <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-start gap-3 rounded-md p-2 -m-2 transition-colors',
              'hover:bg-accent/50',
            )}
          >
            <Checkbox
              id={item.id}
              checked={value.includes(item.policyVersion)}
              onCheckedChange={() => handleToggle(item.policyVersion)}
              aria-describedby={
                item.description ? `${item.id}-description` : undefined
              }
              className="mt-0.5"
            />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor={item.id}
                className="text-sm leading-relaxed cursor-pointer block"
              >
                {item.isRequired && (
                  <span className="text-destructive mr-1" aria-label="wymagane">
                    *
                  </span>
                )}
                <span className="text-muted-foreground">Akceptuję </span>
                {item.linkUrl ? (
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    {item.label.replace('Akceptuję ', '')}
                    <FileText className="w-3.5 h-3.5 inline-block" />
                  </a>
                ) : (
                  <span className="font-medium">
                    {item.label.replace('Akceptuję ', '')}
                  </span>
                )}
              </Label>
              {item.description && (
                <p
                  id={`${item.id}-description`}
                  className="text-xs text-muted-foreground leading-relaxed"
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
