import { useNavigate, useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '../auth.api';
import { loginRoute } from '../route';

export function LoginForm() {
  const navigate = useNavigate();
  const router = useRouter();
  const { redirect: redirectPath } = loginRoute.useSearch();

  const mutation = useMutation({
    mutationFn: signIn,
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
      alert(`Błąd logowania: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    mutation.mutate({ email, password });
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

      {mutation.isError && <p className="text-red-500">Coś poszło nie tak!</p>}
    </form>
  );
}
