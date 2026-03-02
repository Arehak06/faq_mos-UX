import { useNavigate, useLocation } from 'react-router-dom';
import { TelegramLogin } from '../components/TelegramLogin';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <div className="page">
      <h1 className="page-title">Вход для администраторов</h1>
      <p>Для доступа к админ-панели необходимо войти через Telegram.</p>
      <TelegramLogin />
      <p style={{ marginTop: '20px' }}>
        <button className="tg-button" onClick={() => navigate(from)}>
          ← Вернуться назад
        </button>
      </p>
    </div>
  );
}