import React, { useState, useEffect, useRef, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import { PageData } from '../types/page';
import { isAdmin } from '../utils/isAdmin';

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAdmin(isAdmin());
    loadPages().then(data => setPages(data)).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const renderIcon = (icon: string | undefined, className: string) => {
    if (!icon) return <span className={className}>📄</span>;
    if (icon.startsWith('http')) {
      return <img src={icon} alt="" className={`${className} custom-icon`} />;
    }
    return <span className={className}>{icon}</span>;
  };

  const renderMenuItems = (parentId: string | null = null): JSX.Element[] => {
    if (!pages) return [];
    const children = Object.values(pages)
      .filter(page => !page.hidden && (page.parentId || null) === parentId)
      .sort((a, b) => a.title.localeCompare(b.title));

    return children.flatMap(page => [
      <div
        key={page.id}
        className="menu-item"
        onClick={() => handleNavigate(`/${page.id}`)}
        style={{ paddingLeft: parentId ? 32 : 12 }}
      >
        {renderIcon(page.emoji, 'menu-item-emoji')}
        <span className="menu-item-title">{page.title}</span>
      </div>,
      ...renderMenuItems(page.id)
    ]);
  };

  if (!pages) return null;

  const adminSections = [
  { path: '/admin', icon: '🛠️', title: 'Админка', desc: 'Управление' },
  { path: '/admin/upload', icon: '📤', title: 'Загрузка', desc: 'Изображения' },
  { path: '/logs', icon: '📋', title: 'Журнал', desc: 'Действия' },
];

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button className="hamburger-icon" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      {isOpen && (
        <div className="menu-dropdown">
          <div className="menu-section">
            <div className="menu-section-title">Навигация</div>
            <div className="menu-item" onClick={() => handleNavigate('/')}>
              {renderIcon('🏠', 'menu-item-emoji')}
              <span className="menu-item-title">Главная</span>
            </div>
            {renderMenuItems(null)}
          </div>
          {admin && (
            <div className="menu-section">
              <div className="menu-section-title">Управление</div>
              {adminSections.map(item => (
                <div key={item.path} className="menu-item" onClick={() => handleNavigate(item.path)}>
                  <span className="menu-item-emoji">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}