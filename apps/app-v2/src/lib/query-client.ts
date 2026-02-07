import { QueryClient } from '@tanstack/react-query';
import { AppError } from '../services/errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof AppError) {
          const status = error.status ?? 0;
          if (
            status >= 400 &&
            status < 500 &&
            status !== 408 &&
            status !== 429
          ) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
