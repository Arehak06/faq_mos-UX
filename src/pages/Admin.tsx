import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import { getTelegramUser, getTelegramUserName, clearTelegramUser } from '../utils/telegram';
import { PageData } from '../types/page';

export default function Admin() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const [loading, setLoading] = useState(true);

  const user = getTelegramUser();
  const userName = getTelegramUserName() || 'Администратор';
  const userPhoto = user?.photo_url;

  useEffect(() => {
    loadPages()
      .then(data => {
        setPages(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    clearTelegramUser();
    navigate('/');
  };

  if (loading) return <div className="page">Загрузка...</div>;

  return (
    <div className="page">
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
        <div className="dashboard-card" onClick={() => navigate('/admin/users')}>
          <div className="card-icon">👥</div>
          <div className="card-title">Администраторы</div>
          <div className="card-desc">Управление ролями и приглашения</div>
        </div>
      </div>
    </div>
  );
}