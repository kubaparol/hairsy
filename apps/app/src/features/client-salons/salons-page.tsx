import * as React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCompleteSalons } from '@/entities/salon';
import { PublicLayout } from '@/features/public-header';
import { Input } from '@/shared/ui/components/input';
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
  EmptyMedia,
} from '@/shared/ui/components/empty';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { Search } from 'lucide-react';
import { salonsRoute } from './route';

export function SalonsPage() {
  const { city: searchCity } = useSearch({ from: salonsRoute.id });
  const [cityInput, setCityInput] = React.useState(searchCity ?? '');
  const [submittedCity, setSubmittedCity] = React.useState<string | undefined>(
    searchCity ?? undefined,
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    setCityInput(searchCity ?? '');
    setSubmittedCity(searchCity ?? undefined);
  }, [searchCity]);

  const filters = React.useMemo(
    () => (submittedCity ? { city: submittedCity } : undefined),
    [submittedCity],
  );
  const { data, isLoading, isFetching } = useCompleteSalons(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cityInput.trim();
    setSubmittedCity(trimmed || undefined);
    navigate({
      to: '/salons',
      search: { city: trimmed || undefined },
      replace: true,
    });
  };

  const showEmptyWithCity =
    submittedCity && data && data.data.length === 0 && !isFetching;
  const showEmptyNoSalons =
    !submittedCity && data && data.data.length === 0 && !isFetching;

  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-svh flex-col gap-6 p-4 md:p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Znajdź salon
          </h1>
          <p className="text-muted-foreground text-sm">
            {submittedCity
              ? `Salony w mieście "${submittedCity}"`
              : 'Wszystkie salony'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Filtruj po mieście, np. Warszawa, Kraków"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="pl-9"
              aria-label="Miasto"
            />
          </div>
          <Button type="submit" variant="default">
            Szukaj
          </Button>
        </form>

        {showEmptyWithCity && (
          <Empty className="flex-1 py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search className="size-6" />
              </EmptyMedia>
              <EmptyTitle>Brak salonów w tym mieście</EmptyTitle>
              <EmptyDescription>
                W miejscowości &quot;{submittedCity}&quot; nie znaleziono
                salonów. Spróbuj innego miasta lub sprawdź pisownię.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {showEmptyNoSalons && (
          <Empty className="flex-1 py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search className="size-6" />
              </EmptyMedia>
              <EmptyTitle>Brak salonów</EmptyTitle>
              <EmptyDescription>
                W systemie nie ma jeszcze żadnych salonów. Sprawdź ponownie
                później lub jeśli jesteś właścicielem salonu, zarejestruj się i
                dodaj swój salon.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {data && data.data.length > 0 && (
          <section className="space-y-4" aria-label="Lista salonów">
            <p className="text-muted-foreground text-sm">
              Znaleziono {data.count}{' '}
              {data.count === 1
                ? 'salon'
                : data.count < 5
                  ? 'salony'
                  : 'salonów'}
              {submittedCity && ` w "${submittedCity}"`}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((salon) => (
                <SalonCard key={salon.id!} salon={salon} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}

function SalonCard({
  salon,
}: {
  salon: { id: string | null; name: string | null; city: string | null };
}) {
  const id = salon.id!;
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-muted/50"
      onClick={() =>
        navigate({ to: '/salons/$salonId', params: { salonId: id } })
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate({ to: '/salons/$salonId', params: { salonId: id } });
        }
      }}
      tabIndex={0}
      role="button"
    >
      <CardHeader>
        <CardTitle className="line-clamp-1">{salon.name ?? 'Salon'}</CardTitle>
        <CardDescription>{salon.city ?? '—'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Kliknij, aby zobaczyć szczegóły i zarezerwować wizytę
        </p>
      </CardContent>
    </Card>
  );
}
