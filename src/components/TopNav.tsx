import React, { useState, useEffect, useRef, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import { PageData } from '../types/page';
import { isAdmin } from '../utils/isAdmin';

export function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PageData[]>([]);
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAdmin(isAdmin());
    loadPages().then(data => setPages(data)).catch(console.error);
  }, []);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Поиск по страницам
  useEffect(() => {
    if (!pages || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = Object.values(pages)
      .filter(page => !page.hidden && (page.title?.toLowerCase().includes(query) || page.description?.toLowerCase().includes(query)))
      .slice(0, 10); // ограничим 10 результатами
    setSearchResults(results);
  }, [searchQuery, pages]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const renderIcon = (icon: string | undefined) => {
    if (!icon) return <span className="menu-item-emoji">📄</span>;
    if (icon.startsWith('http')) {
      return <img src={icon} alt="" className="menu-item-emoji custom-icon" />;
    }
    return <span className="menu-item-emoji">{icon}</span>;
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
        {renderIcon(page.emoji)}
        <span className="menu-item-title">{page.title}</span>
      </div>,
      ...renderMenuItems(page.id)
    ]);
  };

  if (!pages) return null;

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <div className="nav-left">
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
          <div className="logo" onClick={() => handleNavigate('/')}>
          </div>
        </div>

        <div className="nav-right">
          <div className="search-wrapper" ref={searchRef}>
            <button className="search-toggle" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              🔍
            </button>
            {isSearchOpen && (
              <div className="search-dropdown">
                <input
                  type="text"
                  placeholder="Поиск страниц..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map(page => (
                      <div
                        key={page.id}
                        className="search-result-item"
                        onClick={() => handleNavigate(`/${page.id}`)}
                      >
                        {renderIcon(page.emoji)}
                        <div className="search-result-text">
                          <div className="search-result-title">{page.title}</div>
                          {page.description && <div className="search-result-desc">{page.description}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {searchQuery && searchResults.length === 0 && (
                  <div className="search-no-results">Ничего не найдено</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Выпадающее меню страниц */}
        {isMenuOpen && (
          <div className="menu-dropdown" ref={menuRef}>
            <div className="menu-section">
              <div className="menu-section-title">Навигация</div>
              <div className="menu-item" onClick={() => handleNavigate('/')}>
                {renderIcon('🏠')}
                <span>Главная</span>
              </div>
              {renderMenuItems(null)}
            </div>
            {admin && (
              <div className="menu-section">
                <div className="menu-section-title">Управление</div>
                <div className="menu-item" onClick={() => handleNavigate('/admin')}>
                  {renderIcon('🛠️')}
                  <span>Админка</span>
                </div>
                <div className="menu-item" onClick={() => handleNavigate('/logs')}>
                  {renderIcon('📋')}
                  <span>Журнал</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}