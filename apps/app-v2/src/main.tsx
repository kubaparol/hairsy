import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { queryClient } from './lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toast } from '@heroui/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toast.Container placement="top" />
    </QueryClientProvider>
  </StrictMode>,
);
