import { Link, useParams } from '@tanstack/react-router';
import { useSalon } from '@/entities/salon';
import { useServicesBySalon } from '@/entities/service';
import { useWorkingHoursBySalon } from '@/entities/working-hours';
import { salonDetailRoute } from './route';
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
import { ArrowLeft, Clock, MapPin, Phone } from 'lucide-react';
import type { Tables } from '@/core/database.types';

const DAY_NAMES = [
  'Niedziela',
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
] as const;

function formatTime(time: string) {
  return time.slice(0, 5);
}

export function SalonDetailPage() {
  const { salonId } = useParams({ from: salonDetailRoute.id });
  const {
    data: salon,
    isLoading: salonLoading,
    isError: salonError,
  } = useSalon(salonId);
  const { data: services, isLoading: servicesLoading } =
    useServicesBySalon(salonId);
  const { data: workingHours, isLoading: hoursLoading } =
    useWorkingHoursBySalon(salonId);

  const today = new Date().getDay();

  if (salonLoading) {
    return (
      <div className="flex min-h-svh flex-col gap-6 p-4 md:p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (salonError || !salon) {
    return (
      <div className="flex min-h-svh flex-col gap-6 p-4 md:p-6">
        <Button variant="ghost" asChild>
          <Link to="/salons" search={{ city: undefined }}>
            ← Wróć do listy
          </Link>
        </Button>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Salon niedostępny</EmptyTitle>
            <EmptyDescription>
              Ten salon nie istnieje lub nie jest jeszcze dostępny do
              rezerwacji. Wróć do listy i wybierz inny salon.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to="/salons" search={{ city: undefined }}>
                Szukaj salonów
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const address = [
    salon.street,
    salon.street_number,
    salon.postal_code,
    salon.city,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex min-h-svh flex-col gap-6 p-4 md:p-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/salons" search={{ city: undefined }} className="gap-1">
          <ArrowLeft className="size-4" />
          Wróć do listy
        </Link>
      </Button>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {salon.name ?? 'Salon'}
        </h1>
        {salon.description && (
          <p className="text-muted-foreground text-sm">{salon.description}</p>
        )}
      </header>

      <section className="space-y-2" aria-label="Dane kontaktowe">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kontakt i adres</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {salon.phone && (
              <p className="flex items-center gap-2 text-sm">
                <Phone className="text-muted-foreground size-4 shrink-0" />
                <a href={`tel:${salon.phone}`} className="underline">
                  {salon.phone}
                </a>
              </p>
            )}
            {address && (
              <p className="flex items-start gap-2 text-sm">
                <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <span>{address}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {hoursLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : workingHours && workingHours.length > 0 ? (
        <section aria-label="Godziny pracy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-4" />
                Godziny pracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {DAY_NAMES.map((label, dayOfWeek) => {
                  const wh = workingHours.find(
                    (h: Tables<'working_hours'>) => h.day_of_week === dayOfWeek,
                  );
                  const isToday = dayOfWeek === today;
                  return (
                    <li
                      key={dayOfWeek}
                      className={`flex justify-between text-sm ${isToday ? 'font-medium' : ''}`}
                    >
                      <span>
                        {label}
                        {isToday && (
                          <span className="text-muted-foreground ml-1">
                            (dziś)
                          </span>
                        )}
                      </span>
                      <span>
                        {wh
                          ? `${formatTime(wh.open_time)} – ${formatTime(wh.close_time)}`
                          : 'Zamknięte'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </section>
      ) : null}

      <section aria-label="Usługi">
        <h2 className="text-lg font-semibold">Usługi</h2>
        {servicesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : services && services.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {services.map((service: Tables<'services'>) => (
              <ServiceCard
                key={service.id}
                salonId={salon.id}
                service={service}
              />
            ))}
          </ul>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground text-sm">
                Brak dostępnych usług.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function ServiceCard({
  salonId,
  service,
}: {
  salonId: string;
  service: Tables<'services'>;
}) {
  const duration = service.duration_minutes;
  const priceText = `${service.price} zł`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-base">{service.name}</CardTitle>
          <CardDescription>
            {duration} min · {priceText}
          </CardDescription>
        </div>
        <Button asChild size="sm">
          <Link
            to="/salons/$salonId/book"
            params={{ salonId }}
            search={{ serviceId: service.id }}
          >
            Zarezerwuj
          </Link>
        </Button>
      </CardHeader>
      {service.description && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm">{service.description}</p>
        </CardContent>
      )}
    </Card>
  );
}
