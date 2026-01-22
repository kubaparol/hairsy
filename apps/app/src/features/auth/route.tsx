import { createRoute, redirect } from '@tanstack/react-router';
import { supabase } from '@/core/supabase';
import { LoginForm } from './components/LoginForm';
import { rootRoute } from '@/app/root';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || undefined,
    };
  },
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Jeśli użytkownik jest już zalogowany, przekieruj do dashboardu
    if (session) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: () => <LoginForm />,
});
