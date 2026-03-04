import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageEditor from './PageEditor';
import PageView from './PageView';
import { loadPages, savePages } from '../utils/storage';
import { useTelegramMainButton } from '../hooks/useTelegramMainButton';
import { useConfirmExitSimple } from '../hooks/useConfirmExitSimple';
import { addLog } from '../services/logService';
import { PageData } from '../types/page';
import { getTelegramUserName, getTelegramUser } from '../utils/telegram';

export default function PageManagement() {
  const navigate = useNavigate();

  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [originalPages, setOriginalPages] = useState<Record<string, PageData> | null>(null);
  const [current, setCurrent] = useState('home');
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    loadPages()
      .then(data => {
        setPages(data);
        setOriginalPages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки страниц:', err);
        setLoading(false);
      });
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    if (!pages || !originalPages) return false;
    return JSON.stringify(pages) !== JSON.stringify(originalPages);
  }, [pages, originalPages]);

  useConfirmExitSimple(hasUnsavedChanges, 'У вас есть несохранённые изменения. Выйти без сохранения?');

  const handleSave = async () => {
    if (!pages) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const userName = getTelegramUserName() || String(getTelegramUser()?.id) || 'unknown';

      const pagesToSave = Object.fromEntries(
        Object.entries(pages).map(([key, page]) => {
          const newPage = { ...page };
          if (!newPage.createdAt) {
            newPage.createdAt = now;
            newPage.createdBy = userName;
          }
          newPage.updatedAt = now;
          newPage.updatedBy = userName;
          newPage.description = newPage.description ?? '';
          newPage.emoji = newPage.emoji ?? '📄';
          return [key, newPage];
        })
      );

      await savePages(pagesToSave);
      setPages(pagesToSave);
      setOriginalPages(pagesToSave);
      await addLog('pages_saved', undefined, { pages: Object.keys(pagesToSave) });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPage = () => {
    if (!pages) return;
    let key = prompt('Введите уникальный ключ страницы (например, "newpage"):');
    if (!key) return;
    key = key.trim().toLowerCase().replace(/\s+/g, '-');
    if (pages[key]) {
      alert('Страница с таким ключом уже существует');
      return;
    }
    const title = prompt('Введите название страницы:', 'Новая страница');
    if (!title) return;

    const now = new Date().toISOString();
    const userName = getTelegramUserName() || String(getTelegramUser()?.id) || 'unknown';

    const newPage: PageData = {
      id: key,
      title,
      blocks: [],
      hidden: false,
      createdAt: now,
      createdBy: userName,
      updatedAt: now,
      updatedBy: userName,
      description: '',
      emoji: '📄',
    };
    const updatedPages = { ...pages, [key]: newPage };
    setPages(updatedPages);
    setCurrent(key);
    addLog('page_created', key, { title });
  };

  const handleDeletePage = (key: string) => {
    if (!pages) return;
    if (key === 'home') {
      alert('Нельзя удалить главную страницу');
      return;
    }
    const pageTitle = pages[key]?.title || key;
    if (window.confirm(`Удалить страницу "${pageTitle}" (${key})? Это действие необратимо.`)) {
      const updatedPages = { ...pages };
      delete updatedPages[key];
      setPages(updatedPages);
      if (current === key) {
        setCurrent('home');
      }
      addLog('page_deleted', key);
    }
  };

  useTelegramMainButton({
    text: saving ? '💾 Сохранение...' : '💾 Сохранить',
    visible: mode === 'edit' && !saving,
    onClick: handleSave,
  });

  const filteredPages = useMemo(() => {
    if (!pages) return [];
    const entries = Object.entries(pages);
    return entries.filter(([key, page]) => {
      const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            page.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHidden = showHidden || !page.hidden;
      return matchesSearch && matchesHidden;
    });
  }, [pages, searchTerm, showHidden]);

  if (loading) return <div className="page">Загрузка...</div>;
  if (!pages) return <div className="page">Ошибка загрузки</div>;

  const page = pages[current];

  return (
    <div className="page">
      <h1 className="page-title">📄 Управление страницами</h1>

      {/* Кнопка возврата в админку */}
      <button className="back-to-admin" onClick={() => navigate('/admin')}>
        ← Назад в кабинет
      </button>

      <div className="admin-card">
        <div className="admin-card-title">🔍 Фильтр страниц</div>
        <input
          type="text"
          placeholder="Поиск по названию или ключу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid var(--tg-border)' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
          />
          Показать скрытые страницы
        </label>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">📄 Страница</div>
        <select
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--tg-border)', marginBottom: '12px' }}
        >
          {filteredPages.map(([key, page]) => (
            <option key={key} value={key}>
              {key} {page.hidden ? '(скрыта)' : ''}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button className="tg-button" onClick={handleAddPage} style={{ flex: 1 }}>
            ➕ Новая страница
          </button>
          {current !== 'home' && (
            <button
              className="tg-button danger"
              onClick={() => handleDeletePage(current)}
              style={{ flex: 1, background: '#ff4d4f' }}
            >
              🗑️ Удалить
            </button>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">👁 Режим</div>
        <button className="tg-button" onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}>
          {mode === 'edit' ? '👁 Просмотр' : '✏️ Редактор'}
        </button>
      </div>

      {mode === 'edit' ? (
        <PageEditor
          page={page}
          onChange={(updatedPage) => setPages({ ...pages, [current]: updatedPage })}
        />
      ) : (
        <PageView page={page} />
      )}
    </div>
  );
}