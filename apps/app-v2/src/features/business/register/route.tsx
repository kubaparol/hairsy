import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../router';
import { BusinessRegisterView } from './business-register-view';

export const businessRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business/register',
  component: () => (
    <div>
      <BusinessRegisterView />
    </div>
  ),
});
