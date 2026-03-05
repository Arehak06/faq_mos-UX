import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import { PageData } from '../types/page';
import { Loading } from '../components/Loading';
import NotFound from './NotFound';

export default function AdminInvite() {
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadPages()
      .then(data => {
        setPages(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!pages) return;
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const homePage = pages['home'];
    if (homePage?.inviteToken && token === homePage.inviteToken) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [pages, location.search]);

  const handleLogin = () => {
    navigate('/login', { state: { from: '/admin' } });
  };

  if (loading) return <Loading />;

  if (!valid) {
    return <NotFound />;
  }

  return (
    <div className="invite-page">
      <div className="invite-card">
        <div className="invite-icon">🔐</div>
        <h1 className="invite-title">Приглашение в админ‑панель</h1>
        <p className="invite-text">
          Вы получили приглашение для доступа к управлению сайтом. Для продолжения необходимо авторизоваться через Telegram.
        </p>
        <button className="invite-button tg-button" onClick={handleLogin}>
          <span className="button-icon">📱</span>
          Войти через Telegram
        </button>
        <div className="invite-footer">
          <a href="/" className="invite-link">← Вернуться на главную</a>
        </div>
      </div>
    </div>
  );
}