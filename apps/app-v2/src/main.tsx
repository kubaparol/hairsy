import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import { queryClient } from './lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toast } from '@heroui/react';
import { RouterAuthProvider } from './router/router-auth-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterAuthProvider />
      <Toast.Container placement="top" />
    </QueryClientProvider>
  </StrictMode>,
);
