import { useNavigate, useRouter } from '@tanstack/react-router';
import { useSignIn, SupabaseError, SupabaseErrorCode } from '@/entities';
import { loginRoute } from '../route';

export function LoginForm() {
  const navigate = useNavigate();
  const router = useRouter();
  const { redirect: redirectPath } = loginRoute.useSearch();

  const mutation = useSignIn({
    onSuccess: async () => {
      // 1. Ważne: Mówimy routerowi, że stan autoryzacji się zmienił.
      // Router ponownie wywoła 'beforeLoad' w trasach i odświeży kontekst.
      await router.invalidate();

      // 2. Przekierowanie do dashboardu lub do strony, z której użytkownik został przekierowany
      await navigate({
        to: redirectPath || '/dashboard',
      });
    },
    onError: (error) => {
      // Loguj pełny błąd w development dla debugowania
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      if (import.meta.env.DEV) {
        console.error('Sign in error:', error);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    mutation.mutate({ email, password });
  };

  // Helper do wyświetlania przyjaznych komunikatów błędów
  const getErrorMessage = (error: SupabaseError | null): string | null => {
    if (!error) return null;

    // Możemy dostosować komunikaty dla konkretnych typów błędów
    if (error.is(SupabaseErrorCode.RATE_LIMITED)) {
      return 'Zbyt wiele prób logowania. Poczekaj chwilę i spróbuj ponownie.';
    }

    return error.message;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 max-w-sm mx-auto"
    >
      <h1 className="text-xl font-bold">Zaloguj się</h1>

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="border p-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Hasło"
        required
        className="border p-2"
      />

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
      >
        {mutation.isPending ? 'Logowanie...' : 'Zaloguj'}
      </button>

      {mutation.error && (
        <p className="text-red-500 text-sm">
          {getErrorMessage(mutation.error)}
        </p>
      )}
    </form>
  );
}
