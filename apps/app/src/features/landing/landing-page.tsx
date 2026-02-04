import { Link } from '@tanstack/react-router';
import { Search, Calendar, Users } from 'lucide-react';
import { Button } from '@/shared/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/components/card';
import { PublicLayout } from '@/features/public-header';

/**
 * Landing Page (`/`)
 *
 * Cel: Wprowadzenie do aplikacji i przekierowanie do głównych przepływów.
 *
 * Komponenty:
 * - HeroSection - główny nagłówek z wyszukiwarką
 * - ValueProposition - karty korzyści dla USER i OWNER
 * - CTAButtons - przyciski "Znajdź salon" i "Dla właścicieli"
 */
export function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-linear-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Rezerwuj wizyty w salonach fryzjerskich{' '}
              <span className="text-primary">24/7</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Znajdź salon w swojej okolicy i zarezerwuj wizytę w kilka sekund.
              Bez dzwonienia, bez czekania.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link to="/salons" search={{ city: undefined }}>
                  <Search className="mr-2 h-5 w-5" />
                  Znajdź salon
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/sign-up">Dla właścicieli salonów</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Dlaczego Hairsy?
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Dla klientów */}
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Dla klientów</CardTitle>
                <CardDescription>
                  Rezerwuj wizyty bez dzwonienia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Przeglądaj salony w swojej okolicy i sprawdzaj ich ofertę
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Rezerwuj dostępne terminy 24/7, bez konieczności
                      dzwonienia
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Zarządzaj swoimi wizytami w jednym miejscu</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Dla właścicieli */}
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Dla właścicieli</CardTitle>
                <CardDescription>
                  Zarządzaj salonem w jednym miejscu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Jeden kalendarz obejmujący rezerwacje online i manualne
                      blokady
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Automatyczne zarządzanie dostępnością bez ryzyka
                      podwójnych rezerwacji
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Zwiększ widoczność salonu i pozyskuj nowych klientów
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Gotowy, żeby zacząć?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Zarezerwuj wizytę w salonie lub dodaj swój salon do platformy.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link to="/salons" search={{ city: undefined }}>
                Znajdź salon
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/sign-up">Zarejestruj salon</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
