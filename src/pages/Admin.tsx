import { useEffect, useState } from 'react';
import PageEditor from './PageEditor';
import PageView from './PageView';
import { loadPages, savePages } from '../utils/storage';
import { useTelegramMainButton } from '../hooks/useTelegramMainButton';

export default function Admin() {
  const [pages, setPages] = useState<Record<string, any> | null>(null);
  const [current, setCurrent] = useState('home');
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages()
      .then(setPages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!pages) return;
    setSaving(true);
    try {
      await savePages(pages);
      // Можно показать уведомление об успехе
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  useTelegramMainButton({
    text: saving ? '💾 Сохранение...' : '💾 Сохранить',
    visible: mode === 'edit' && !saving,
    onClick: handleSave,
  });

  if (loading) return <div className="page">Загрузка...</div>;
  if (!pages) return <div className="page">Ошибка загрузки</div>;

  const page = pages[current];

  return (
    <div className="page">
      <h1 className="page-title">🛠 Админка</h1>

      <div className="admin-card">
        <div className="admin-card-title">Страница</div>
        <select value={current} onChange={(e) => setCurrent(e.target.value)}>
          {Object.keys(pages).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Режим</div>
        <button className="tg-button" onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}>
          {mode === 'edit' ? '👁 Просмотр' : '✏️ Редактор'}
        </button>
      </div>

      {mode === 'edit' ? (
        <PageEditor page={page} onChange={(p) => setPages({ ...pages, [current]: p })} />
      ) : (
        <PageView page={page} />
      )}
    </div>
  );
}