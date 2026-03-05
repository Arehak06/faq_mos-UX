import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signIn } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async () => {
    try {
      await signIn();
    } catch (err) {
      console.error('Login error:', err);
      alert('Не удалось инициировать вход через Telegram. Попробуйте позже.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🚇</div>
          <h1 className="login-title">Вход для администраторов</h1>
        </div>

        <p className="login-description">
          Для доступа к управлению сайтом необходимо авторизоваться через Telegram.
          Нажмите кнопку ниже, и вы будете перенаправлены в Telegram для подтверждения.
        </p>

        <button className="login-button tg-button" onClick={handleLogin}>
          <span className="button-icon">🔐</span>
          Войти через Telegram
        </button>

        <div className="login-footer">
          <a href="/" className="login-link">← На главную</a>
        </div>
      </div>
    </div>
  );
}