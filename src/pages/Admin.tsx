import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageEditor from './PageEditor';
import PageView from './PageView';
import { loadPages, savePages } from '../utils/storage';
import { useTelegramMainButton } from '../hooks/useTelegramMainButton';
import { useConfirmExitSimple } from '../hooks/useConfirmExitSimple';
import { addLog } from '../services/logService';
import { PageData, AdminUser, InviteToken } from '../types/page';
import { getTelegramUser, getTelegramUserName, clearTelegramUser } from '../utils/telegram';

export default function Admin() {
  const navigate = useNavigate();

  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [originalPages, setOriginalPages] = useState<Record<string, PageData> | null>(null);
  const [current, setCurrent] = useState('home');
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  const user = getTelegramUser();
  const userName = getTelegramUserName() || 'Администратор';
  const userPhoto = user?.photo_url;

  // Данные для управления админами
  const [homePage, setHomePage] = useState<PageData | null>(null);
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [inviteTokens, setInviteTokens] = useState<InviteToken[]>([]);

  useEffect(() => {
    loadPages()
      .then(data => {
        setPages(data);
        setOriginalPages(data);
        const home = data['home'];
        setHomePage(home);
        setAdminList(home?.adminList || []);
        setInviteTokens(home?.inviteTokens || []);
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
      setHomePage(pagesToSave['home']);
      setAdminList(pagesToSave['home']?.adminList || []);
      setInviteTokens(pagesToSave['home']?.inviteTokens || []);
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
    const children = Object.values(pages).filter(p => p.parentId === key);
    if (children.length > 0) {
      const confirm = window.confirm(`У страницы есть дочерние подразделы (${children.length}). Они также будут удалены. Продолжить?`);
      if (!confirm) return;
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

  const handleLogout = () => {
    clearTelegramUser();
    navigate('/');
  };

  // Генерация пригласительного токена
  const generateInvite = async () => {
    if (!homePage) return;
    const role = prompt('Введите роль для приглашения (admin / editor):', 'editor');
    if (role !== 'admin' && role !== 'editor') return;
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newInvite: InviteToken = {
      token,
      role,
      createdAt: new Date().toISOString(),
    };
    const updatedHome = {
      ...homePage,
      inviteTokens: [...(homePage.inviteTokens || []), newInvite],
    };
    const updatedPages = { ...pages, home: updatedHome };
    setPages(updatedPages);
    setHomePage(updatedHome);
    setInviteTokens(updatedHome.inviteTokens || []);
    addLog('invite_created', 'home', { token, role });
    alert(`Ссылка для приглашения:\n${window.location.origin}/faq_mos-UX/admin/invite?token=${token}`);
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
      {/* Шапка профиля */}
      <div className="profile-header">
        <div className="profile-avatar">
          {userPhoto ? (
            <img src={userPhoto} alt={userName} className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">{userName.charAt(0).toUpperCase()}</div>
          )}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{userName}</h2>
          <div className="profile-role">Администратор</div>
        </div>
        <button className="logout-button" onClick={handleLogout} title="Выйти">🚪</button>
      </div>

      {/* Карточки действий */}
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => setMode('edit')}>
          <div className="card-icon">✏️</div>
          <div className="card-title">Редактор страниц</div>
          <div className="card-desc">Управление контентом</div>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/logs')}>
          <div className="card-icon">📋</div>
          <div className="card-title">Журнал действий</div>
          <div className="card-desc">Просмотр логов</div>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/admin/upload')}>
          <div className="card-icon">📤</div>
          <div className="card-title">Загрузка изображений</div>
          <div className="card-desc">Загрузите картинку и получите ссылку</div>
        </div>
      </div>

      {/* Управление администраторами */}
      <div className="admin-card">
        <div className="admin-card-title">👥 Администраторы</div>
        {adminList.length === 0 ? (
          <p>Список администраторов пуст</p>
        ) : (
          <ul className="admin-list">
            {adminList.map(user => (
              <li key={user.id} className="admin-list-item">
                <span className="admin-id">{user.id}</span>
                <span className="admin-role">({user.role})</span>
              </li>
            ))}
          </ul>
        )}
        <button className="tg-button" onClick={generateInvite}>➕ Пригласить администратора</button>
      </div>

      {/* Остальной интерфейс (фильтры, редактор) */}
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
          allPages={pages}
        />
      ) : (
        <PageView page={page} />
      )}
    </div>
  );
}