import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTelegramUser } from '../utils/telegram';
import { getAdmins, setAdmins } from '../utils/isAdmin';

const API_GATEWAY_URL = 'https://d5d8hp02glq5i9vs2544.z7jmlavt.apigw.yandexcloud.net/auth';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const token = sessionStorage.getItem('invite_token');

    if (!code) {
      console.error('No code');
      navigate('/login');
      return;
    }

    fetch(API_GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setTelegramUser(data.user);

          // Если есть пригласительный токен, добавляем пользователя в администраторы
          if (token) {
            const currentAdmins = getAdmins();
            if (!currentAdmins.includes(data.user.id)) {
              setAdmins([...currentAdmins, data.user.id]);
            }
            sessionStorage.removeItem('invite_token');
          }

          window.location.href = '/';
        } else {
          throw new Error('No user data');
        }
      })
      .catch(err => {
        console.error(err);
        navigate('/login');
      });
  }, [navigate]);

  return <div className="page">Вход выполняется...</div>;
}