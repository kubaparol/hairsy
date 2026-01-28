import { Progress } from '@/shared/ui/components/progress';
import { cn } from '@/shared/utils/cn';

export interface Step {
  id: string;
  label: string;
  description?: string;
}

export interface StepperWizardProps {
  steps: Step[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  allowSkip?: boolean;
  className?: string;
}

/**
 * StepperWizard component for multi-step onboarding flow.
 * Displays progress bar and step indicators.
 */
export function StepperWizard({
  steps,
  currentStep,
  onStepChange,
  allowSkip = false,
  className,
}: StepperWizardProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Krok {currentStep + 1} z {steps.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = allowSkip && onStepChange;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                if (isClickable && index !== currentStep) {
                  onStepChange?.(index);
                }
              }}
              disabled={!isClickable}
              className={cn(
                'flex flex-col items-center gap-2 text-sm transition-colors',
                isClickable && 'cursor-pointer hover:text-foreground',
                !isClickable && 'cursor-default',
                isActive && 'text-foreground font-medium',
                !isActive && !isCompleted && 'text-muted-foreground',
                isCompleted && 'text-primary',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                  isActive &&
                    'border-primary bg-primary text-primary-foreground',
                  isCompleted &&
                    'border-primary bg-primary text-primary-foreground',
                  !isActive &&
                    !isCompleted &&
                    'border-muted-foreground bg-background',
                )}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="text-center">
                <div className="font-medium">{step.label}</div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
