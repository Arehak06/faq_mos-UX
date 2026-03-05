import { signIn } from '../../services/authService';

interface Props {
  className?: string;
}

export function TelegramLogin({ className }: Props) {
  const handleLogin = () => {
    signIn().catch((err) => {
      console.error('Login error:', err);
      alert('Не удалось инициировать вход. Попробуйте позже.');
    });
  };

  return (
    <button onClick={handleLogin} className={`tg-button ${className || ''}`}>
      🔐 Войти через Telegram
    </button>
  );
}