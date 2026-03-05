import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPages, savePages } from '../utils/storage';
import { PageData, InviteToken } from '../types/page';
import { getTelegramUser } from '../utils/telegram';
import { addLog } from '../services/logService';
import { Loading } from '../components/Loading';
import { getAdmins, setAdmins } from '../utils/isAdmin';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [homePage, setHomePage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpenFor, setMenuOpenFor] = useState<number | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [newInviteLink, setNewInviteLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const currentUser = getTelegramUser();
  const adminList = getAdmins(); // синхронно из localStorage

  useEffect(() => {
    loadPages()
      .then(data => {
        setPages(data);
        setHomePage(data['home']);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleRemove = async (userId: number) => {
    if (userId === currentUser?.id) {
      alert('Нельзя удалить самого себя');
      return;
    }
    if (!window.confirm('Вы уверены, что хотите удалить этого администратора?')) return;
    const newList = adminList.filter(id => id !== userId);
    setAdmins(newList);
    window.location.reload(); // перезагружаем для обновления прав
  };

  const handleAddAdminClick = () => setShowRoleSelector(true);

  const handleRoleSelect = async (role: 'admin' | 'editor') => {
    if (!homePage || !pages) return;
    setShowRoleSelector(false);
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
    await savePages(updatedPages);
    addLog('invite_created', 'home', { token, role });
    const link = `${window.location.origin}/faq_mos-UX/admin/invite?token=${token}`;
    setNewInviteLink(link);
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
        <div className="admin-card-title">Список администраторов (ID)</div>
        {adminList.length === 0 ? (
          <p>Пока нет администраторов</p>
        ) : (
          <ul className="admin-list">
            {adminList.map(id => (
              <li key={id} className="admin-list-item">
                <span className="admin-id">{id}</span>
                {currentUser?.id !== id ? (
                  <div className="admin-actions">
                    <button className="action-button" onClick={() => setMenuOpenFor(menuOpenFor === id ? null : id)}>⋮</button>
                    {menuOpenFor === id && (
                      <div className="action-menu">
                        <button className="danger" onClick={() => handleRemove(id)}>Удалить</button>
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

      <div className="admin-card" style={{ marginTop: 20 }}>
        <div className="admin-card-title">➕ Добавить администратора</div>
        {!showRoleSelector && !newInviteLink && (
          <button className="tg-button" onClick={handleAddAdminClick}>Создать приглашение</button>
        )}
        {showRoleSelector && (
          <div className="role-selector">
            <p>Выберите роль для нового администратора (роль пока не используется):</p>
            <div className="role-buttons">
              <button className="tg-button" onClick={() => handleRoleSelect('admin')}>Администратор</button>
              <button className="tg-button" onClick={() => handleRoleSelect('editor')}>Редактор</button>
            </div>
          </div>
        )}
        {newInviteLink && (
          <div className="invite-link-container">
            <p className="invite-link-label">Ссылка для приглашения:</p>
            <div className="invite-link-row">
              <input type="text" value={newInviteLink} readOnly className="invite-link-input" />
              <button className="copy-button" onClick={copyToClipboard}>{copySuccess ? '✓' : '📋'}</button>
            </div>
            <button className="tg-button" style={{ marginTop: 8 }} onClick={() => setNewInviteLink(null)}>Готово</button>
          </div>
        )}
      </div>
    </div>
  );
}