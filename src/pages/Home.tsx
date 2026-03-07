import React, { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import { PageData } from '../types/page';
import { isAdmin } from '../utils/isAdmin';
import { getTelegramUser } from '../utils/telegram';
import { BlockRenderer } from '../components/BlockRenderer';
import { PageTitle } from '../components/common/PageTitle';
import { Loading } from '../components/common/Loading';


export default function Home() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(isAdmin());
  const [user, setUser] = useState(getTelegramUser());
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [loading, setLoading] = useState(true);

  // Слушаем изменения пользователя (сохранение/удаление из localStorage)
  useEffect(() => {
    const handleUserChange = () => {
      setUser(getTelegramUser());
      setAdmin(isAdmin());
    };
    window.addEventListener('telegram-user-changed', handleUserChange);
    return () => window.removeEventListener('telegram-user-changed', handleUserChange);
  }, []);

  // Дополнительно проверяем при монтировании (для Telegram WebApp)
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

  const renderPageList = (pagesToRender: PageData[], parentId: string | null = null, level = 0): JSX.Element[] => {
    const children = pagesToRender
      .filter(page => !page.hidden && (page.parentId || null) === parentId)
      .sort((a, b) => {
        const orderA = a.order ?? 0;
        const orderB = b.order ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
      });

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
      ...renderPageList(pagesToRender, page.id, level + 1)
    ]);
  };

  if (loading) return <Loading />;
  if (!pages) return <div className="page">Ошибка загрузки данных</div>;

  const homePage = pages['home'];
  const homeBlocks = homePage?.blocks || [];

  const allOtherPages = Object.values(pages).filter(p => p.id !== 'home');

  const featuredPages = allOtherPages
    .filter(p => p.featured && !p.hidden)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));

  const regularPages = allOtherPages
    .filter(p => !p.featured && !p.hidden)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));

  const mainTitle = homePage?.mainTitle || '';
  const sectionTitle = homePage?.sectionTitle || 'ВСЕ СТРАНИЦЫ';

  return (
    <div className="page">
      <PageTitle title={mainTitle} showShare={false} />

      {homeBlocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}

      {/* {!user && !admin && (
        <div className="home-card login-prompt-card" onClick={() => navigate('/login')}>
          <div className="home-item">
            <div className="home-item-icon">🔐</div>
            <div className="home-item-text">
              <div className="home-item-title">Вход для администраторов</div>
              <div className="home-item-subtitle">Авторизуйтесь через Telegram</div>
            </div>
            <div className="home-item-arrow">→</div>
          </div>
        </div>
      )} */}

      {featuredPages.length > 0 && (
        <>
          <div className="home-section-title">📌 Закреплённые</div>
          <div className="home-card">{renderPageList(featuredPages)}</div>
        </>
      )}

      <div className="home-section-title">{sectionTitle}</div>
      <div className="home-card">{renderPageList(regularPages)}</div>

      {admin && (
        <>
          <div className="home-section-title home-admin-section">Админ панель</div>
          <div className="home-card">
            <div className="home-item" onClick={() => navigate('/admin')}>
              <div className="home-item-icon">🛠️</div>
              <div className="home-item-text">
                <div className="home-item-title">Админ панель</div>
                <div className="home-item-subtitle">Управление сайтом</div>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}