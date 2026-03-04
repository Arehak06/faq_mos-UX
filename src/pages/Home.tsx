import { JSX, useEffect, useState } from 'react';
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

  // Рекурсивная отрисовка страниц
  const renderPages = (parentId: string | null = null, level = 0): JSX.Element[] => {
    const children = Object.values(pages)
      .filter(page => !page.hidden && (page.parentId || null) === parentId)
      .sort((a, b) => a.title.localeCompare(b.title));
    return children.flatMap(page => [
      <div
        key={page.id}
        className="home-item"
        onClick={() => navigate(`/${page.id}`)}
        style={{ paddingLeft: level * 16 + 16 }}
      >
        <span className="home-item-icon">{page.emoji || '📄'}</span>
        <div className="home-item-text">
          <div className="home-item-title">{page.title}</div>
          {page.description && <div className="home-item-subtitle">{page.description}</div>}
        </div>
      </div>,
      ...renderPages(page.id, level + 1)
    ]);
  };

  return (
    <div className="page">
      <h1 className="page-title">🎫 Билетик - справочник по транспорту Москвы и области</h1>

      {/* Блоки главной страницы */}
      {homeBlocks.map(block => <BlockRenderer key={block.id} block={block} />)}

      {/* Кнопка входа для администраторов */}
      {/* {!user && !admin && (
        <div className="home-card" style={{ marginBottom: '20px', border: '2px solid var(--tg-accent)' }}>
          <div className="home-item" onClick={() => navigate('/login')}>
            <span className="home-item-icon">🔐</span>
            <div className="home-item-text">
              <div className="home-item-title">Вход для администраторов</div>
              <div className="home-item-subtitle">Авторизуйтесь через Telegram</div>
            </div>
          </div>
        </div>
      )} */}

      {/* Основные разделы (статические) – можно тоже сделать через pages, но оставим как есть */}
      <div className="home-section-title">Справочник</div>
      <div className="home-card">
        {/* Здесь можно добавить статические ссылки или оставить как есть */}
        {/* Например, если они есть в pages, они будут отрисованы через renderPages */}
      </div>

      {/* Динамические страницы */}
      {Object.values(pages).filter(p => !p.hidden).length > 0 && (
        <>
          <div className="home-section-title">Все страницы</div>
          <div className="home-card">
            {renderPages(null)}
          </div>
        </>
      )}

      {admin && (
        <>
          <div className="home-section-title home-admin-section">Управление</div>
          <div className="home-card">
            <div className="home-item" onClick={() => navigate('/admin')}>
              <span className="home-item-icon">🛠️</span>
              <div className="home-item-text">
                <div className="home-item-title">Админка</div>
                <div className="home-item-subtitle">Управление страницами</div>
              </div>
            </div>
            <div className="home-item" onClick={() => navigate('/logs')}>
              <span className="home-item-icon">📋</span>
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