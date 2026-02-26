import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageEditor from './PageEditor';
import PageView from './PageView';
import { loadPages, savePages } from '../utils/storage';
import { useTelegramMainButton } from '../hooks/useTelegramMainButton';
import { useConfirmExitSimple } from '../hooks/useConfirmExitSimple';
import { addLog } from '../services/logService';

// Интерфейс для новой страницы (можно вынести в types, но для простоты здесь)
interface NewPageData {
  key: string;
  title: string;
  blocks: [];
  hidden?: boolean;
}

export default function Admin() {
  const navigate = useNavigate();

  const [pages, setPages] = useState<Record<string, any> | null>(null);
  const [originalPages, setOriginalPages] = useState<Record<string, any> | null>(null);
  const [current, setCurrent] = useState('home');
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Состояния для поиска/фильтра
  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  // Состояния для модального окна создания страницы
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageKey, setNewPageKey] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [createError, setCreateError] = useState('');

  // Загрузка страниц
  useEffect(() => {
    loadPages()
      .then(data => {
        setPages(data);
        setOriginalPages(data);
        // Если текущей страницы нет (например, удалили), выбрать первую
        if (!data[current] && Object.keys(data).length > 0) {
          setCurrent(Object.keys(data)[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки страниц:', err);
        setLoading(false);
      });
  }, [current]);

  // Проверка на несохранённые изменения
  const hasUnsavedChanges = useMemo(() => {
    if (!pages || !originalPages) return false;
    return JSON.stringify(pages) !== JSON.stringify(originalPages);
  }, [pages, originalPages]);

  // Хук подтверждения выхода
  useConfirmExitSimple(hasUnsavedChanges, 'У вас есть несохранённые изменения. Выйти без сохранения?');

  // Сохранение страниц
  const handleSave = async () => {
    if (!pages) return;
    setSaving(true);
    try {
      await savePages(pages);
      setOriginalPages(pages);
      await addLog('pages_saved', undefined, { pages: Object.keys(pages) });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
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

  // Создание новой страницы
  const handleCreatePage = () => {
    // Валидация
    if (!newPageKey.trim()) {
      setCreateError('Ключ страницы не может быть пустым');
      return;
    }
    if (!newPageTitle.trim()) {
      setCreateError('Название страницы не может быть пустым');
      return;
    }
    if (pages && pages[newPageKey]) {
      setCreateError('Страница с таким ключом уже существует');
      return;
    }

    // Создаём новую страницу с базовой структурой
    const newPage = {
      id: newPageKey,
      title: newPageTitle,
      blocks: [],
      hidden: false,
    };

    const updatedPages = { ...pages, [newPageKey]: newPage };
    setPages(updatedPages);
    setCurrent(newPageKey); // переключаемся на новую страницу
    setShowCreateModal(false);
    setNewPageKey('');
    setNewPageTitle('');
    setCreateError('');

    // Логируем создание
    addLog('page_created', newPageKey);
  };

  // Удаление страницы
  const handleDeletePage = (keyToDelete: string) => {
    if (!pages) return;

    // Нельзя удалить все страницы? Оставим хотя бы одну
    if (Object.keys(pages).length <= 1) {
      alert('Нельзя удалить последнюю страницу');
      return;
    }

    if (window.confirm(`Удалить страницу "${keyToDelete}"? Это действие нельзя отменить.`)) {
      const { [keyToDelete]: removed, ...restPages } = pages;
      setPages(restPages);

      // Если удалили текущую страницу, переключаемся на первую доступную
      if (keyToDelete === current) {
        const firstKey = Object.keys(restPages)[0];
        setCurrent(firstKey);
      }

      // Логируем удаление
      addLog('page_deleted', keyToDelete);
    }
  };

  if (loading) return <div className="page">Загрузка...</div>;
  if (!pages) return <div className="page">Ошибка загрузки</div>;

  const page = pages[current];

  return (
    <div className="page">
      <h1 className="page-title">🛠 Админ-панель</h1>

      {/* Панель управления страницами */}
      <div className="admin-card">
        <div className="admin-card-title">📁 Управление страницами</div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            className="tg-button"
            style={{ flex: 1 }}
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Новая страница
          </button>
          <button
            className="tg-button"
            style={{ flex: 1, background: '#ff4d4d' }}
            onClick={() => handleDeletePage(current)}
          >
            🗑️ Удалить "{current}"
          </button>
        </div>
      </div>

      {/* Модальное окно создания новой страницы */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '14px',
              padding: '20px',
              width: '300px',
              maxWidth: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Новая страница</h3>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              <span style={{ display: 'block', marginBottom: '5px' }}>Ключ страницы (уникальный)</span>
              <input
                type="text"
                value={newPageKey}
                onChange={(e) => setNewPageKey(e.target.value)}
                placeholder="например: newpage"
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--tg-border)' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              <span style={{ display: 'block', marginBottom: '5px' }}>Название страницы</span>
              <input
                type="text"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="Название"
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--tg-border)' }}
              />
            </label>
            {createError && <p style={{ color: 'red', margin: '5px 0' }}>{createError}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button
                className="tg-button"
                style={{ flex: 1 }}
                onClick={handleCreatePage}
              >
                Создать
              </button>
              <button
                className="tg-button"
                style={{ flex: 1, background: '#888' }}
                onClick={() => setShowCreateModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="admin-card-title">📄 Текущая страница</div>
        <select
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--tg-border)' }}
        >
          {filteredPages.map(([key, page]) => (
            <option key={key} value={key}>
              {key} {page.hidden ? '(скрыта)' : ''}
            </option>
          ))}
        </select>
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