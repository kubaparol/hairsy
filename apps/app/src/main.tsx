import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './kernel/styles/global.css';
import {
  protectedLayoutRoute,
  publicLayoutRoute,
  rootRoute,
} from './cross-shell/routing/roots';
import { publicRoutes } from './shells/public/routes';
import { mainRoutes } from './shells/main/routes';
import { createRouter, RouterProvider } from '@tanstack/react-router';

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  publicLayoutRoute.addChildren(publicRoutes);
  protectedLayoutRoute.addChildren(mainRoutes);

  const routeTree = rootRoute.addChildren([
    publicLayoutRoute,
    protectedLayoutRoute,
  ]);

  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
  });

  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
