import React, { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import { PageData } from '../types/page';
import { isAdmin } from '../utils/isAdmin';
import { getTelegramUser } from '../utils/telegram';
import { BlockRenderer } from '../components/BlockRenderer';
import { PageTitle } from '../components/PageTitle';
import { Loading } from '../components/Loading';

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

  // Функция для рендеринга списка страниц (рекурсивно)
  const renderPageList = (pagesToRender: PageData[], parentId: string | null = null, level = 0): JSX.Element[] => {
    const children = pagesToRender
  .filter(page => !page.hidden && (page.parentId || null) === parentId)
  .sort((a, b) => {
    // Сначала по order (если есть, иначе 0)
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    // Если order равны, сортируем по заголовку
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

  // Все страницы, кроме home
  const allOtherPages = Object.values(pages).filter(p => p.id !== 'home');

  // Разделяем на закреплённые и обычные
  const featuredPages = allOtherPages
  .filter(p => p.featured && !p.hidden)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));
const regularPages = allOtherPages
  .filter(p => !p.featured && !p.hidden)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));

  const adminSections = [
    { path: '/admin', icon: '🛠️', title: 'Админка', subtitle: 'Управление страницами' },
    { path: '/logs', icon: '📋', title: 'Журнал', subtitle: 'Действия администраторов' },
  ];

  // Заголовки из страницы home (или значения по умолчанию)
  const mainTitle = homePage?.mainTitle || '🚇 Транспорт Москвы';
  const sectionTitle = homePage?.sectionTitle || 'ВСЕ СТРАНИЦЫ';

  return (
    <div className="page">
      <PageTitle title={mainTitle} showShare={false} />

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

      {/* Закреплённые разделы */}
      {featuredPages.length > 0 && (
        <>
          <div className="home-section-title">📌 Закреплённые</div>
          <div className="home-card">
            {renderPageList(featuredPages)}
          </div>
        </>
      )}

      {/* Обычные страницы */}
      <div className="home-section-title">{sectionTitle}</div>
      <div className="home-card">
        {renderPageList(regularPages)}
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