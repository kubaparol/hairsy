import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { ClientRegisterView } from './client-register-view';

export const clientRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => (
    <div>
      <ClientRegisterView />
    </div>
  ),
});
