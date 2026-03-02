import { useNavigate, useLocation } from 'react-router-dom';
import { TelegramLogin } from '../components/TelegramLogin';
import { setTelegramUser } from '../utils/telegram';
import { TelegramLoginWidgetData } from '@advanceddev/telegram-login-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleAuth = (user: TelegramLoginWidgetData) => {
    // Сохраняем пользователя в localStorage
    setTelegramUser(user);
    // Здесь можно отправить данные на сервер для проверки hash
    // fetch('/api/validate-telegram', { method: 'POST', body: JSON.stringify(user) })
    navigate(from, { replace: true });
  };

  return (
    <div className="page">
      <h1 className="page-title">Вход для администраторов</h1>
      <p>Для доступа к админ-панели необходимо войти через Telegram.</p>
      <TelegramLogin onAuth={handleAuth} />
    </div>
  );
}