import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import { PageData } from '../types/page';
import { isAdmin } from '../utils/isAdmin';
import { getTelegramUser } from '../utils/telegram';
import { BlockRenderer } from '../components/BlockRenderer';

export default function Home() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [loading, setLoading] = useState(true);

  const user = getTelegramUser();

  useEffect(() => {
    setAdmin(isAdmin());
  }, [user]);

  useEffect(() => {
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

  const homePage = pages['home'];
  const homeBlocks = homePage?.blocks || [];

  // Основные разделы (статические)
  const mainSections = [
    { path: '/tickets', icon: '🎟️', title: 'Билеты', subtitle: 'Тройка, тарифы, льготы' },
    { path: '/schedule', icon: '⏱️', title: 'Расписание', subtitle: 'Метро, МЦД, МЦК' },
    { path: '/rights', icon: '⚖️', title: 'Права пассажира', subtitle: 'Контролёры и проверки' },
    { path: '/fines', icon: '💸', title: 'Штрафы', subtitle: 'За что и сколько' },
    { path: '/about', icon: 'ℹ️', title: 'О проекте', subtitle: 'Контакты и источники' },
  ];

  const adminSections = [
    { path: '/admin', icon: '🛠️', title: 'Админка', subtitle: 'Управление страницами' },
    { path: '/logs', icon: '📋', title: 'Журнал', subtitle: 'Действия администраторов' },
  ];

  return (
    <div className="page">
      <h1 className="page-title">🚇 Транспорт Москвы</h1>

      {/* Блоки, добавленные через админку */}
      {homeBlocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}

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
        {mainSections.map((item) => (
          <div
            key={item.path}
            className="home-item"
            onClick={() => navigate(item.path)}
          >
            <div className="home-item-icon">{item.icon}</div>
            <div className="home-item-text">
              <div className="home-item-title">{item.title}</div>
              <div className="home-item-subtitle">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Дополнительные страницы (динамические) */}
      {Object.entries(pages)
        .filter(([key, page]) => !['home', ...mainSections.map(s => s.path.slice(1))].includes(key) && !page.hidden)
        .map(([key, page]) => (
          <div key={key} className="home-card">
            <div className="home-item" onClick={() => navigate(`/${key}`)}>
              <div className="home-item-icon">{page.emoji || '📄'}</div>
              <div className="home-item-text">
                <div className="home-item-title">{page.title}</div>
                <div className="home-item-subtitle">{page.description || 'Дополнительная страница'}</div>
              </div>
            </div>
          </div>
        ))}

      {admin && (
        <>
          <div className="home-section-title home-admin-section">Управление</div>
          <div className="home-card">
            {adminSections.map((item) => (
              <div
                key={item.path}
                className="home-item"
                onClick={() => navigate(item.path)}
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
    </div>
  );
}