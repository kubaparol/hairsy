import {
  QueryClient,
  QueryClientProvider,
  type QueryClientProviderProps,
} from '@tanstack/react-query';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount) => failureCount < 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      networkMode: 'always',
    },
  },
});

const QueryProvider = ({
  children,
}: Pick<QueryClientProviderProps, 'children'>) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export { QueryProvider };
