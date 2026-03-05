import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdmins, setAdmins, getTelegramUserData } from '../utils/isAdmin';
import { AdminUser, AdminRole } from '../config/admins';
import { getTelegramUser } from '../utils/telegram';
import { Loading } from '../components/Loading';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newId, setNewId] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('editor');

  const currentUser = getTelegramUser();

  useEffect(() => {
    setAdminList(getAdmins());
    setLoading(false);
  }, []);

  const handleRemove = (id: number) => {
    if (id === currentUser?.id) {
      alert('Нельзя удалить самого себя');
      return;
    }
    if (!window.confirm('Удалить администратора?')) return;
    const newList = adminList.filter(a => a.id !== id);
    setAdmins(newList);
    setAdminList(newList);
  };

  const handleRoleChange = (id: number, newRole: AdminRole) => {
    const newList = adminList.map(a => a.id === id ? { ...a, role: newRole } : a);
    setAdmins(newList);
    setAdminList(newList);
  };

  const handleAdd = () => {
    const id = parseInt(newId.trim());
    if (isNaN(id)) {
      alert('Введите корректный ID');
      return;
    }
    if (adminList.some(a => a.id === id)) {
      alert('Такой администратор уже есть');
      return;
    }
    const newAdmin: AdminUser = { id, role: newRole };
    const newList = [...adminList, newAdmin];
    setAdmins(newList);
    setAdminList(newList);
    setShowAddForm(false);
    setNewId('');
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
            {adminList.map(user => {
              const userData = getTelegramUserData(user.id);
              return (
                <li key={user.id} className="admin-list-item">
                  <div className="admin-user-info">
                    {userData?.photo_url ? (
                      <img src={userData.photo_url} alt="" className="admin-avatar" />
                    ) : (
                      <div className="admin-avatar-placeholder">{user.id.toString().slice(-2)}</div>
                    )}
                    <div className="admin-details">
                      <div className="admin-name">
                        {userData ? `${userData.first_name} ${userData.last_name || ''}` : `ID: ${user.id}`}
                        {user.id === currentUser?.id && <span className="self-mark"> (это вы)</span>}
                      </div>
                      {userData?.username && <div className="admin-username">@{userData.username}</div>}
                    </div>
                  </div>
                  <div className="admin-role-controls">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as AdminRole)}
                      className="role-select"
                      disabled={user.id === currentUser?.id} // нельзя менять свою роль
                    >
                      <option value="owner">Владелец</option>
                      <option value="admin">Администратор</option>
                      <option value="editor">Редактор</option>
                    </select>
                    {user.id !== currentUser?.id && (
                      <button className="danger" onClick={() => handleRemove(user.id)}>Удалить</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!showAddForm ? (
        <button className="tg-button" onClick={() => setShowAddForm(true)}>➕ Добавить администратора</button>
      ) : (
        <div className="admin-card">
          <div className="admin-card-title">Добавление администратора</div>
          <div className="add-form">
            <input
              type="text"
              placeholder="Telegram ID"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
            />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value as AdminRole)}>
              <option value="owner">Владелец</option>
              <option value="admin">Администратор</option>
              <option value="editor">Редактор</option>
            </select>
            <div className="form-buttons">
              <button className="tg-button" onClick={handleAdd}>Добавить</button>
              <button className="tg-button danger" onClick={() => setShowAddForm(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}