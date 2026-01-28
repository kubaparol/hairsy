import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useUser } from '@/entities/auth';
import { useSalonByOwner } from '@/entities/salon';
import { useCreateSalon, useUpdateSalon } from '@/entities/salon';
import { useCreateService } from '@/entities/service';
import { useUpsertWorkingHours } from '@/entities/working-hours';
import { StepperWizard, type Step } from './stepper-wizard';
import { Step1SalonData } from './step-1-salon-data';
import { Step2Address } from './step-2-address';
import { Step3WorkingHours } from './step-3-working-hours';
import { Step4FirstService } from './step-4-first-service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/components/card';
import type { CreateSalonInput } from '@/entities/salon';
import type { CreateServiceInput } from '@/entities/service';
import type { WorkingHoursInput } from '@/entities/working-hours';

const STEPS: Step[] = [
  {
    id: 'salon-data',
    label: 'Dane salonu',
    description: 'Podstawowe informacje',
  },
  { id: 'address', label: 'Adres', description: 'Lokalizacja salonu' },
  {
    id: 'working-hours',
    label: 'Godziny pracy',
    description: 'Harmonogram tygodniowy',
  },
  {
    id: 'first-service',
    label: 'Pierwsza usługa',
    description: 'Dodaj usługę',
  },
];

/**
 * Main onboarding wizard component.
 * Multi-step form for configuring salon after owner registration.
 */
export function OnboardingWizard() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { data: salon } = useSalonByOwner(user?.id);

  const createSalonMutation = useCreateSalon();
  const updateSalonMutation = useUpdateSalon();
  const createServiceMutation = useCreateService();
  const upsertWorkingHoursMutation = useUpsertWorkingHours();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [salonData, setSalonData] = React.useState<Partial<CreateSalonInput>>(
    {},
  );

  // Load existing salon data if available
  React.useEffect(() => {
    if (salon) {
      setSalonData({
        name: salon.name ?? undefined,
        description: salon.description ?? undefined,
        phone: salon.phone ?? undefined,
        street: salon.street ?? undefined,
        street_number: salon.street_number ?? undefined,
        postal_code: salon.postal_code ?? undefined,
        city: salon.city ?? undefined,
      });
    }
  }, [salon]);

  const handleStep1Submit = async (data: CreateSalonInput) => {
    if (!user?.id) return;

    try {
      if (salon) {
        await updateSalonMutation.mutateAsync({
          salonId: salon.id,
          updates: data,
        });
      } else {
        await createSalonMutation.mutateAsync({
          ownerId: user.id,
          data,
        });
        setSalonData((prev) => ({ ...prev, ...data }));
      }
      setCurrentStep(1);
    } catch (error) {
      toast.error('Nie udało się zapisać danych salonu');
      throw error;
    }
  };

  const handleStep2Submit = async (data: Partial<CreateSalonInput>) => {
    if (!salon) {
      toast.error('Najpierw uzupełnij dane salonu');
      return;
    }

    try {
      await updateSalonMutation.mutateAsync({
        salonId: salon.id,
        updates: data,
      });
      setSalonData((prev) => ({ ...prev, ...data }));
      setCurrentStep(2);
    } catch (error) {
      toast.error('Nie udało się zapisać adresu');
      throw error;
    }
  };

  const handleStep3Submit = async (data: WorkingHoursInput[]) => {
    if (!salon) {
      toast.error('Najpierw uzupełnij dane salonu');
      return;
    }

    try {
      await upsertWorkingHoursMutation.mutateAsync({
        salonId: salon.id,
        data,
      });
      setCurrentStep(3);
    } catch (error) {
      toast.error('Nie udało się zapisać godzin pracy');
      throw error;
    }
  };

  const handleStep4Submit = async (data: CreateServiceInput) => {
    if (!salon) {
      toast.error('Najpierw uzupełnij dane salonu');
      return;
    }

    try {
      await createServiceMutation.mutateAsync({
        salonId: salon.id,
        data,
      });
      toast.success('Onboarding zakończony pomyślnie!');
      navigate({ to: '/app' });
    } catch (error) {
      toast.error('Nie udało się dodać usługi');
      throw error;
    }
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Konfiguracja salonu</CardTitle>
          <CardDescription>
            Wypełnij podstawowe informacje o swoim salonie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <StepperWizard
            steps={STEPS}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            allowSkip={true}
          />

          <div className="min-h-[400px]">
            {currentStep === 0 && (
              <Step1SalonData
                initialValues={salonData}
                onSubmit={handleStep1Submit}
                onSkip={handleSkip}
              />
            )}
            {currentStep === 1 && (
              <Step2Address
                initialValues={salonData}
                onSubmit={handleStep2Submit}
                onBack={handleBack}
                onSkip={handleSkip}
              />
            )}
            {currentStep === 2 && (
              <Step3WorkingHours
                onSubmit={handleStep3Submit}
                onBack={handleBack}
                onSkip={handleSkip}
              />
            )}
            {currentStep === 3 && (
              <Step4FirstService
                onSubmit={handleStep4Submit}
                onBack={handleBack}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
