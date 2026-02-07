import { CheckCircle } from 'lucide-react';
import { Button } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';

interface SignUpSuccessProps {
  userType: 'client' | 'business';
}

export const SignUpSuccess = ({ userType }: SignUpSuccessProps) => {
  const navigate = useNavigate();

  const description =
    userType === 'client'
      ? 'Twoje konto klienta zostało utworzone. Możesz teraz zalogować się i zacząć umawiać wizyty.'
      : 'Twoje konto biznesowe zostało utworzone. Możesz teraz zalogować się i skonfigurować swój salon.';

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent/10">
        <CheckCircle className="size-10 text-accent" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Konto utworzone pomyślnie!
        </h1>
        <p className="text-muted">{description}</p>
      </div>

      <Button
        onClick={() => navigate({ to: '/auth/sign-in' })}
        className="w-full"
      >
        Przejdź do logowania
      </Button>
    </div>
  );
};
