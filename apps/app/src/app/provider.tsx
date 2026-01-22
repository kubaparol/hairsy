import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/query-client';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
