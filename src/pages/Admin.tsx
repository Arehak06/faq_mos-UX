import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageEditor from './PageEditor';
import PageView from './PageView';
import { loadPages, savePages } from '../utils/storage';
import { useTelegramMainButton } from '../hooks/useTelegramMainButton';
import { useConfirmExitSimple } from '../hooks/useConfirmExitSimple';
import { addLog } from '../services/logService';
import { PageData } from '../types/page';

export default function Admin() {
  const navigate = useNavigate();

  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [originalPages, setOriginalPages] = useState<Record<string, PageData> | null>(null);
  const [current, setCurrent] = useState('home');
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Для поиска и фильтрации
  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  // Загрузка страниц
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

  // Проверка на несохранённые изменения
  const hasUnsavedChanges = useMemo(() => {
    if (!pages || !originalPages) return false;
    return JSON.stringify(pages) !== JSON.stringify(originalPages);
  }, [pages, originalPages]);

  // Хук подтверждения выхода (упрощённый)
  useConfirmExitSimple(hasUnsavedChanges, 'У вас есть несохранённые изменения. Выйти без сохранения?');

  // Сохранение страниц
  const handleSave = async () => {
    if (!pages) return;
    setSaving(true);
    try {
      await savePages(pages);
      setOriginalPages(pages);
      await addLog('pages_saved', undefined, { pages: Object.keys(pages) });
      // В будущем здесь можно добавить уведомление
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Добавление новой страницы
  const handleAddPage = () => {
    if (!pages) return;
    const key = prompt('Введите уникальный ключ страницы (например, "newpage"):');
    if (!key) return;
    // Проверяем, что ключ не занят
    if (pages[key]) {
      alert('Страница с таким ключом уже существует');
      return;
    }
    const title = prompt('Введите название страницы:', 'Новая страница');
    if (!title) return;

    const newPage: PageData = {
      id: key,
      title,
      blocks: [],
      hidden: true, // по умолчанию скрыта, чтобы не появлялась сразу в публичном доступе
    };
    const updatedPages = { ...pages, [key]: newPage };
    setPages(updatedPages);
    setCurrent(key);
    addLog('page_created', key, { title });
  };

  // Удаление страницы
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

  // Кнопка Telegram
  useTelegramMainButton({
    text: saving ? '💾 Сохранение...' : '💾 Сохранить',
    visible: mode === 'edit' && !saving,
    onClick: handleSave,
  });

  // Фильтрация страниц
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
      <h1 className="page-title">🛠 Админ-панель</h1>

      {/* Поиск и фильтр */}
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

      {/* Выбор страницы */}
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

        {/* Кнопки управления страницами */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            className="tg-button"
            onClick={handleAddPage}
            style={{ flex: 1 }}
          >
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

      {/* Переключение режима */}
      <div className="admin-card">
        <div className="admin-card-title">👁 Режим</div>
        <button className="tg-button" onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}>
          {mode === 'edit' ? '👁 Просмотр' : '✏️ Редактор'}
        </button>
      </div>

      {/* Контент */}
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