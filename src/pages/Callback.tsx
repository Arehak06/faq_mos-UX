import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTelegramUser } from '../utils/telegram';

// ⚠️ ЗАМЕНИТЕ НА АКТУАЛЬНЫЙ URL ВАШЕГО API GATEWAY
const API_GATEWAY_URL = 'https://d5d8hp02glq5i9vs2544.z7jmlavt.apigw.yandexcloud.net';

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state'); // можно проверить (опционально)

    if (!code) {
      setError('No authorization code received');
      setLoading(false);
      return;
    }

    fetch(API_GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setTelegramUser(data.user);
          navigate('/');
        } else {
          setError('Authentication failed');
        }
      })
      .catch((err) => {
        console.error('Callback error:', err);
        setError(err.message || 'Network error');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="page">
        <p>Вход выполняется, пожалуйста, подождите...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Ошибка</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Вернуться к входу</button>
      </div>
    );
  }

  return null;
}