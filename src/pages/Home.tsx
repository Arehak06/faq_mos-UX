import React, { JSX, useEffect, useState } from 'react';
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

  const renderIcon = (icon: string | undefined) => {
    if (!icon) return <span className="home-item-icon">📄</span>;
    if (icon.startsWith('http')) {
      return <img src={icon} alt="" className="home-item-icon custom-icon" />;
    }
    return <span className="home-item-icon">{icon}</span>;
  };

  // Рекурсивное отображение страниц с учётом parentId
  const renderPageList = (parentId: string | null = null, level = 0): JSX.Element[] => {
    if (!pages) return [];
    const children = Object.values(pages)
      .filter(page => !page.hidden && (page.parentId || null) === parentId)
      .sort((a, b) => a.title.localeCompare(b.title));

    return children.flatMap(page => [
      <div
        key={page.id}
        className="home-item"
        onClick={() => navigate(`/${page.id}`)}
        style={{ paddingLeft: 12 + level * 20 }}
      >
        {renderIcon(page.emoji)}
        <div className="home-item-text">
          <div className="home-item-title">{page.title}</div>
          {page.description && <div className="home-item-subtitle">{page.description}</div>}
        </div>
      </div>,
      ...renderPageList(page.id, level + 1)
    ]);
  };

  if (loading) return <div className="page">Загрузка...</div>;
  if (!pages) return <div className="page">Ошибка загрузки данных</div>;

  const homePage = pages['home'];
  const homeBlocks = homePage?.blocks || [];

  // Административные разделы (оставляем статическими)
  const adminSections = [
    { path: '/admin', icon: '🛠️', title: 'Админка', subtitle: 'Управление страницами' },
    { path: '/logs', icon: '📋', title: 'Журнал', subtitle: 'Действия администраторов' },
  ];

  return (
    <div className="page">
      <h1 className="page-title">🎫 Билетик - справочник по транспорту Москвы и области</h1>

      {/* Блоки, добавленные через админку для главной страницы */}
      {homeBlocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}

      {/* Кнопка входа для администраторов (если не авторизован) */}
      {/* {!user && !admin && (
        <div className="home-card" style={{ marginBottom: '20px', border: '2px solid var(--tg-accent)' }}>
          <div className="home-item" onClick={() => navigate('/login')}>
            <div className="home-item-icon">🔐</div>
            <div className="home-item-text">
              <div className="home-item-title">Вход для администраторов</div>
              <div className="home-item-subtitle">Авторизуйтесь через Telegram</div>
            </div>
          </div>
        </div>
      )} */}

      {/* Все страницы (кроме home) отображаются здесь с иерархией */}
      <div className="home-section-title">ВСЕ СТРАНИЦЫ</div>
      <div className="home-card">
        {renderPageList(null)}
      </div>

      {/* Административные разделы (только для админов) */}
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