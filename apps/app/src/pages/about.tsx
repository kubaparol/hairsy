import { createRoute } from '@tanstack/react-router';
import { APP_URLS } from '../router/urls';
import { rootRoute } from '../router';

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: APP_URLS.ABOUT,
  component: function About() {
    return (
      <div className="p-2">
        <h3>Hello from About!</h3>
      </div>
    );
  },
});
