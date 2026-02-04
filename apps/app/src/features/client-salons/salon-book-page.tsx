import { Link, useParams, useSearch } from '@tanstack/react-router';
import { useSalon } from '@/entities/salon';
import { useService } from '@/entities/service';
import { PublicLayout } from '@/features/public-header';
import { salonBookRoute } from './route';
import { Button } from '@/shared/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/components/card';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/shared/ui/components/empty';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { ArrowLeft, Calendar } from 'lucide-react';

export function SalonBookPage() {
  const { salonId } = useParams({ from: salonBookRoute.id });
  const { serviceId } = useSearch({ from: salonBookRoute.id });
  const {
    data: salon,
    isLoading: salonLoading,
    isError: salonError,
  } = useSalon(salonId);
  const { data: service, isLoading: serviceLoading } = useService(serviceId);

  const isLoading = salonLoading || (serviceId && serviceLoading);
  const notFound = salonError || !salon || (serviceId && !service);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto flex min-h-svh flex-col gap-6 p-4 md:p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (notFound) {
    return (
      <PublicLayout>
        <div className="container mx-auto flex min-h-svh flex-col gap-6 p-4 md:p-6">
          <Button variant="ghost" asChild>
            <Link to="/salons" search={{ city: undefined }}>
              ← Wróć do listy
            </Link>
          </Button>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Nie można wybrać terminu</EmptyTitle>
              <EmptyDescription>
                Salon lub usługa nie jest dostępna. Wróć do szczegółów salonu i
                wybierz usługę ponownie.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/salons/$salonId" params={{ salonId: salonId ?? '' }}>
                  Powrót do salonu
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-svh flex-col gap-6 p-4 md:p-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/salons/$salonId" params={{ salonId }} className="gap-1">
            <ArrowLeft className="size-4" />
            Wróć do salonu
          </Link>
        </Button>

        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Wybór terminu
          </h1>
          <p className="text-muted-foreground text-sm">
            Wybierz dostępny termin wizyty.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4" />
              {salon.name ?? 'Salon'}
            </CardTitle>
            {service && (
              <CardDescription>
                {service.name} · {service.duration_minutes} min ·{' '}
                {service.price} zł
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Wybór dostępnych slotów czasowych będzie dostępny w kolejnej
              wersji (funkcjonalność 5.4 – Availability and Booking).
            </p>
            <Button asChild className="mt-4">
              <Link to="/salons/$salonId" params={{ salonId }}>
                Wróć do salonu
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
