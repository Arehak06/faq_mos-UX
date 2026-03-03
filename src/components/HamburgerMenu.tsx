import { useState, useEffect, useRef } from 'react';
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

  if (!pages) return null;

  // Функция для рендеринга иконки (эмодзи или картинка)
  const renderIcon = (icon: string | undefined, className: string) => {
    if (!icon) return <span className={className}>📄</span>;
    if (icon.startsWith('http')) {
      return <img src={icon} alt="" className={`${className} custom-icon`} />;
    }
    return <span className={className}>{icon}</span>;
  };

  const mainKeys = ['tickets', 'schedule', 'rights', 'fines', 'about'];
  const mainPages = mainKeys
    .filter(key => pages[key] && !pages[key].hidden)
    .map(key => ({ key, title: pages[key].title, emoji: pages[key].emoji || '📄' }));

  const additionalPages = Object.entries(pages)
    .filter(([key, page]) => !mainKeys.includes(key) && !page.hidden && key !== 'home')
    .map(([key, page]) => ({ key, title: page.title, emoji: page.emoji || '📄' }));

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button className="hamburger-icon" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      {isOpen && (
        <div className="menu-dropdown">
          <div className="menu-section">
            <div className="menu-section-title">Основные</div>
            {/* Кнопка на главную */}
            <div className="menu-item" onClick={() => handleNavigate('/')}>
              {renderIcon('🏠', 'menu-item-emoji')}
              <span className="menu-item-title">Главная</span>
            </div>
            {mainPages.map(item => (
              <div key={item.key} className="menu-item" onClick={() => handleNavigate(`/${item.key}`)}>
                {renderIcon(item.emoji, 'menu-item-emoji')}
                <span className="menu-item-title">{item.title}</span>
              </div>
            ))}
          </div>
          {additionalPages.length > 0 && (
            <div className="menu-section">
              <div className="menu-section-title">Дополнительно</div>
              {additionalPages.map(item => (
                <div key={item.key} className="menu-item" onClick={() => handleNavigate(`/${item.key}`)}>
                  {renderIcon(item.emoji, 'menu-item-emoji')}
                  <span className="menu-item-title">{item.title}</span>
                </div>
              ))}
            </div>
          )}
          {admin && (
            <div className="menu-section">
              <div className="menu-section-title">Управление</div>
              <div className="menu-item" onClick={() => handleNavigate('/admin')}>
                <span className="menu-item-emoji">🛠️</span>
                <span>Админка</span>
              </div>
              <div className="menu-item" onClick={() => handleNavigate('/logs')}>
                <span className="menu-item-emoji">📋</span>
                <span>Журнал</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}