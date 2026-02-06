import { Button, Card, Input, Skeleton, Label } from '@heroui/react';

export function ThemeShowcase() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center py-20 px-6">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-light tracking-tight">
            Hairsy <span className="font-semibold">V2</span>
          </h1>
          <p className="text-xl text-default-500 max-w-lg mx-auto">
            Luxury Minimalist Design System
          </p>
        </div>

        <div className="w-full border-b border-secondary/20 my-8" />

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-light">Actions</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Primary (Default)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button isPending>Loading</Button>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-light">Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                variant="primary"
              />
              <span className="text-sm text-default-400">
                We&apos;ll never share your email.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="search">Search Salon</Label>
              <Input
                id="search"
                placeholder="Try 'Warsaw'"
                variant="secondary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="error" className="text-danger">
                Error State
              </Label>
              <Input
                id="error"
                defaultValue="Invalid Input"
                className="border-danger text-danger placeholder:text-danger"
              />
              <span className="text-sm text-danger">
                Please enter a valid value
              </span>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-light">Composition</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Service Service */}
            <Card>
              <Card.Header>
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-lg font-medium">Men&apos;s Haircut</h3>
                    <p className="text-sm text-default-500">
                      Includes wash & style
                    </p>
                  </div>
                  <div className="text-lg font-semibold">$35</div>
                </div>
              </Card.Header>
              <div className="w-full border-b border-default-100 dark:border-default-50" />
              <Card.Content className="flex justify-between items-center text-sm text-default-400 py-4">
                <span>45 mins</span>
                <Button size="sm" variant="secondary">
                  Select
                </Button>
              </Card.Content>
            </Card>

            {/* Profile Card */}
            <Card>
              <Card.Content className="flex flex-row gap-4 items-center p-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-xs text-default-400">Master Stylist</p>
                </div>
                <Button size="sm" variant="ghost">
                  Follow
                </Button>
              </Card.Content>
            </Card>
          </div>
        </section>

        {/* Loading State */}
        <section className="space-y-6">
          <h2 className="text-2xl font-light">States</h2>
          <Card className="w-full space-y-5 p-4">
            <Skeleton className="h-24 rounded-lg bg-default-300" />
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg h-3" />
              <Skeleton className="w-4/5 rounded-lg h-3" />
              <Skeleton className="w-2/5 rounded-lg h-3" />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
