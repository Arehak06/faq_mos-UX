import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import { PageData } from '../types/page';
import { isAdmin } from '../utils/isAdmin';
import { getTelegramUser } from '../utils/telegram';

export default function Home() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [loading, setLoading] = useState(true);

  // Определяем, авторизован ли пользователь
  const [user, setUser] = useState(getTelegramUser());

  const mainKeys = ['tickets', 'schedule', 'rights', 'fines', 'about'];

  const defaultIcons: Record<string, string> = {
    tickets: '🎟️',
    schedule: '⏱️',
    rights: '⚖️',
    fines: '💸',
    about: 'ℹ️',
  };

  const defaultSubtitles: Record<string, string> = {
    tickets: 'Тройка, тарифы, льготы',
    schedule: 'Метро, МЦД, МЦК',
    rights: 'Контролёры и проверки',
    fines: 'За что и сколько',
    about: 'Контакты и источники',
  };

  useEffect(() => {
    setAdmin(isAdmin());
    setUser(getTelegramUser()); // обновляем при монтировании
    loadPages()
      .then(data => {
        setPages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки страниц:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page">Загрузка...</div>;
  if (!pages) return <div className="page">Ошибка загрузки данных</div>;

  const mainPages = mainKeys
    .filter(key => pages[key] && !pages[key].hidden)
    .map(key => ({
      key,
      title: pages[key].title,
      icon: pages[key].emoji || defaultIcons[key] || '📄',
      subtitle: pages[key].description || defaultSubtitles[key] || '',
    }));

  const additionalPages = Object.entries(pages)
    .filter(([key, page]) => !mainKeys.includes(key) && !page.hidden)
    .map(([key, page]) => ({
      key,
      title: page.title,
      icon: page.emoji || '📄',
      subtitle: page.description || 'Дополнительная страница',
    }));

  return (
    <div className="page">
      <h1 className="page-title">🚇 Транспорт Москвы</h1>

      {/* Кнопка входа для администраторов (если не авторизован) */}
      {!user && !admin && (
        <div className="home-card" style={{ marginBottom: '20px', border: '2px solid var(--tg-accent)' }}>
          <div className="home-item" onClick={() => navigate('/login')}>
            <div className="home-item-icon">🔐</div>
            <div className="home-item-text">
              <div className="home-item-title">Вход для администраторов</div>
              <div className="home-item-subtitle">Авторизуйтесь через Telegram</div>
            </div>
          </div>
        </div>
      )}

      <div className="home-section-title">Справочник</div>
      <div className="home-card">
        {mainPages.map(item => (
          <div
            key={item.key}
            className="home-item"
            onClick={() => navigate(`/${item.key}`)}
          >
            <div className="home-item-icon">{item.icon}</div>
            <div className="home-item-text">
              <div className="home-item-title">{item.title}</div>
              {item.subtitle && <div className="home-item-subtitle">{item.subtitle}</div>}
            </div>
          </div>
        ))}
        {mainPages.length === 0 && (
          <div className="home-item" style={{ color: 'var(--tg-hint)' }}>
            Нет доступных страниц
          </div>
        )}
      </div>

      {additionalPages.length > 0 && (
        <>
          <div className="home-section-title">Дополнительно</div>
          <div className="home-card">
            {additionalPages.map(item => (
              <div
                key={item.key}
                className="home-item"
                onClick={() => navigate(`/${item.key}`)}
              >
                <div className="home-item-icon">{item.icon}</div>
                <div className="home-item-text">
                  <div className="home-item-title">{item.title}</div>
                  <div className="home-item-subtitle">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {admin && (
        <>
          <div className="home-section-title home-admin-section">Управление</div>
          <div className="home-card">
            <div className="home-item" onClick={() => navigate('/admin')}>
              <div className="home-item-icon">🛠️</div>
              <div className="home-item-text">
                <div className="home-item-title">Админка</div>
                <div className="home-item-subtitle">Управление страницами</div>
              </div>
            </div>
            <div className="home-item" onClick={() => navigate('/logs')}>
              <div className="home-item-icon">📋</div>
              <div className="home-item-text">
                <div className="home-item-title">Журнал</div>
                <div className="home-item-subtitle">Действия администраторов</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}