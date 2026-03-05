import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = getTelegramUser();
  const userName = getTelegramUserName() || 'Администратор';
  const userPhoto = user?.photo_url;

  // Данные для управления админами
  const [homePage, setHomePage] = useState<PageData | null>(null);
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [inviteTokens, setInviteTokens] = useState<InviteToken[]>([]);
  const [newInviteLink, setNewInviteLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

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

  // Сохраняем изменения на сервер!
  try {
    await savePages(updatedPages);
    console.log('Invite token saved to server');
  } catch (err) {
    console.error('Failed to save invite token', err);
  }

  const link = `${window.location.origin}/faq_mos-UX/admin/invite?token=${token}`;
  setNewInviteLink(link);
  setCopySuccess(false);
  
};

  const copyToClipboard = async () => {
    if (newInviteLink) {
      await navigator.clipboard.writeText(newInviteLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  useTelegramMainButton({
    text: saving ? '💾 Сохранение...' : '💾 Сохранить',
    visible: false,
    onClick: handleSave,
  });

  if (loading) return <div className="page">Загрузка...</div>;
  if (!pages) return <div className="page">Ошибка загрузки</div>;

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
        <div className="dashboard-card" onClick={() => navigate('/admin/pages')}>
          <div className="card-icon">📄</div>
          <div className="card-title">Управление страницами</div>
          <div className="card-desc">Создание, редактирование, удаление</div>
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

        {/* Отображение последней сгенерированной ссылки */}
        {newInviteLink && (
          <div className="invite-link-container">
            <p className="invite-link-label">Ссылка для приглашения (скопируйте и отправьте):</p>
            <div className="invite-link-row">
              <input
                type="text"
                value={newInviteLink}
                readOnly
                className="invite-link-input"
              />
              <button
                className="copy-button"
                onClick={copyToClipboard}
              >
                {copySuccess ? '✓' : '📋'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}