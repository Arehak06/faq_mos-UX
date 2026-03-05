import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPages, savePages } from '../utils/storage';
import { PageData, AdminUser, InviteToken } from '../types/page';
import { getTelegramUser } from '../utils/telegram';
import { addLog } from '../services/logService';
import { Loading } from '../components/Loading';
import { clearAdminsCache } from '../utils/isAdmin';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [homePage, setHomePage] = useState<PageData | null>(null);
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenFor, setMenuOpenFor] = useState<number | null>(null);
  
  // Состояния для добавления администратора
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'editor' | null>(null);
  const [newInviteLink, setNewInviteLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const currentUser = getTelegramUser();

  useEffect(() => {
    loadPages()
      .then(data => {
        setPages(data);
        const home = data['home'];
        setHomePage(home);
        setAdminList(home?.adminList || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChangeRole = async (userId: number, newRole: 'admin' | 'editor') => {
    if (!homePage || !pages) return;
    const updatedList = adminList.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    const updatedHome: PageData = {
      ...homePage,
      adminList: updatedList,
    };
    const updatedPages: Record<string, PageData> = {
      ...pages,
      home: updatedHome,
    };
    setAdminList(updatedList);
    setHomePage(updatedHome);
    setPages(updatedPages);
    await savePages(updatedPages);
    clearAdminsCache(); // сброс кэша прав
    addLog('role_changed', 'home', { userId, newRole });
    setMenuOpenFor(null);
  };

  const handleRemove = async (userId: number) => {
    if (!homePage || !pages || userId === currentUser?.id) {
      if (userId === currentUser?.id) alert('Нельзя удалить самого себя');
      return;
    }
    if (!window.confirm('Вы уверены, что хотите удалить этого администратора?')) return;
    const updatedList = adminList.filter(user => user.id !== userId);
    const updatedHome: PageData = {
      ...homePage,
      adminList: updatedList,
    };
    const updatedPages: Record<string, PageData> = {
      ...pages,
      home: updatedHome,
    };
    setAdminList(updatedList);
    setHomePage(updatedHome);
    setPages(updatedPages);
    await savePages(updatedPages);
    clearAdminsCache(); // сброс кэша прав
    addLog('admin_removed', 'home', { userId });
    setMenuOpenFor(null);
  };

  // Обработчик добавления администратора (выбор роли)
  const handleAddAdminClick = () => {
    setShowRoleSelector(true);
    setNewInviteLink(null); // скрываем старую ссылку
  };

  // Выбор роли и генерация приглашения
  const handleRoleSelect = async (role: 'admin' | 'editor') => {
    if (!homePage || !pages) return;
    setSelectedRole(role);
    setShowRoleSelector(false);
    
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newInvite: InviteToken = {
      token,
      role,
      createdAt: new Date().toISOString(),
    };
    const updatedHome: PageData = {
      ...homePage,
      inviteTokens: [...(homePage.inviteTokens || []), newInvite],
    };
    const updatedPages: Record<string, PageData> = {
      ...pages,
      home: updatedHome,
    };
    setHomePage(updatedHome);
    setPages(updatedPages);
    await savePages(updatedPages);
    // При добавлении приглашения кэш не сбрасываем, так как список админов не меняется
    addLog('invite_created', 'home', { token, role });
    
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

  if (loading) return <Loading />;

  return (
    <div className="page">
      <h1 className="page-title">👥 Управление администраторами</h1>
      <button className="back-to-admin" onClick={() => navigate('/admin')}>← Назад в дашборд</button>

      <div className="admin-card">
        <div className="admin-card-title">Список администраторов</div>
        {adminList.length === 0 ? (
          <p>Пока нет администраторов</p>
        ) : (
          <ul className="admin-list">
            {adminList.map(user => (
              <li key={user.id} className="admin-list-item">
                <span className="admin-id">{user.id}</span>
                <span className={`admin-role role-${user.role}`}>{user.role}</span>
                {currentUser?.id !== user.id ? (
                  <div className="admin-actions">
                    <button className="action-button" onClick={() => setMenuOpenFor(menuOpenFor === user.id ? null : user.id)}>⋮</button>
                    {menuOpenFor === user.id && (
                      <div className="action-menu">
                        <button onClick={() => handleChangeRole(user.id, 'admin')}>Повысить до admin</button>
                        <button onClick={() => handleChangeRole(user.id, 'editor')}>Понизить до editor</button>
                        <button className="danger" onClick={() => handleRemove(user.id)}>Удалить</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="self-mark">(это вы)</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Блок добавления администратора */}
      <div className="admin-card" style={{ marginTop: 20 }}>
        <div className="admin-card-title">➕ Добавить администратора</div>
        
        {!showRoleSelector && !newInviteLink && (
          <button className="tg-button" onClick={handleAddAdminClick}>
            Создать приглашение
          </button>
        )}

        {showRoleSelector && (
          <div className="role-selector">
            <p>Выберите роль для нового администратора:</p>
            <div className="role-buttons">
              <button className="tg-button" onClick={() => handleRoleSelect('admin')}>Администратор</button>
              <button className="tg-button" onClick={() => handleRoleSelect('editor')}>Редактор</button>
            </div>
          </div>
        )}

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
            <button className="tg-button" style={{ marginTop: 8 }} onClick={() => {
              setNewInviteLink(null);
              setShowRoleSelector(false);
            }}>
              Готово
            </button>
          </div>
        )}
      </div>

      {/* Кнопка на страницу авторизации (уже есть в дашборде, но можно оставить) */}
      <div className="dashboard-card" onClick={() => navigate('/login')} style={{ marginTop: 16 }}>
        <div className="card-icon">🔐</div>
        <div className="card-title">Авторизация</div>
        <div className="card-desc">Страница входа для администраторов</div>
      </div>
    </div>
  );
}