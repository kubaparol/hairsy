import { createRoute } from '@tanstack/react-router';
import { APP_URLS } from '../router/urls';
import { rootRoute } from '../router';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: APP_URLS.HOME,
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    );
  },
});
