import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTelegramUser } from '../utils/telegram';
import { userManager } from '../services/authService';

const API_GATEWAY_URL = 'https://d5d8hp02glq5i9vs2544.z7jmlavt.apigw.yandexcloud.net/auth';

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code) {
      setError('No authorization code received');
      setLoading(false);
      return;
    }

    // Извлекаем code_verifier из хранилища oidc-client-ts
    const storageKey = `oidc.user:${userManager.settings.authority}:${userManager.settings.client_id}`;
    const storedStateString = localStorage.getItem(storageKey);
    let code_verifier = null;
    if (storedStateString) {
      try {
        const storedState = JSON.parse(storedStateString);
        code_verifier = storedState.code_verifier;
      } catch (e) {}
    }

    fetch(API_GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state, code_verifier }),
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