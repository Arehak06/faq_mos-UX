import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageEditor from './PageEditor';
import PageView from './PageView';
import { loadPages, savePages } from '../utils/storage';
import { useTelegramMainButton } from '../hooks/useTelegramMainButton';
import { useConfirmExit } from '../hooks/useConfirmExit';
import { addLog } from '../services/logService';

export default function Admin() {
  const navigate = useNavigate();

  const [pages, setPages] = useState<Record<string, any> | null>(null);
  const [originalPages, setOriginalPages] = useState<Record<string, any> | null>(null);
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

  // Хук подтверждения выхода
  useConfirmExit(hasUnsavedChanges, 'У вас есть несохранённые изменения. Выйти без сохранения?');

  // Сохранение страниц
  const handleSave = async () => {
    if (!pages) return;
    setSaving(true);
    try {
      await savePages(pages);
      // Обновляем оригинал после успешного сохранения
      setOriginalPages(pages);
      await addLog('pages_saved', undefined, { pages: Object.keys(pages) });
      // TODO: показать уведомление (позже добавим toast)
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

  // Фильтрация страниц для выпадающего списка
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
      <h1 className="page-title">🛠 Админка</h1>

      {/* Поиск и фильтр */}
      <div className="admin-card">
        <div className="admin-card-title">Фильтр страниц</div>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
          />
          Показать скрытые
        </label>
      </div>

      {/* Выбор страницы */}
      <div className="admin-card">
        <div className="admin-card-title">Страница</div>
        <select
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          style={{ width: '100%' }}
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
        <div className="admin-card-title">Режим</div>
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