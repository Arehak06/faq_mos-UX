import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInCallback } from '../services/authService';
import { setTelegramUser } from '../utils/telegram';

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    signInCallback()
      .then((user) => {
        if (user) {
          // Сохраняем данные пользователя в localStorage (для нашего приложения)
          setTelegramUser(user.profile);
          // Редирект на главную или на страницу, с которой пришли
          navigate('/');
        } else {
          setError('Не удалось получить данные пользователя');
        }
      })
      .catch((err) => {
        console.error('OIDC callback error:', err);
        setError('Ошибка входа. Попробуйте ещё раз.');
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="page">
        <h1>Ошибка</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Вернуться к входу</button>
      </div>
    );
  }

  return (
    <div className="page">
      <p>Вход выполняется, пожалуйста, подождите...</p>
    </div>
  );
}