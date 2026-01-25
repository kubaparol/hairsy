import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/query-client';
import { AuthGate } from './auth-gate';
import '@/core/theme/globals.css';
import { ThemeProvider } from '@/shared/ui/components/theme-provider';
import { Toaster } from '@/shared/ui/components/sonner';

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthGate />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
