import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTelegramUser, getTelegramUserName, clearTelegramUser } from '../utils/telegram';
import { isAdmin } from '../utils/isAdmin'; // на всякий случай, но в AdminRoute уже проверили

export default function Admin() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Администратор');
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    const user = getTelegramUser();
    setUserName(getTelegramUserName() || 'Администратор');
    setUserPhoto(user?.photo_url);
  }, []);

  const handleLogout = () => {
    clearTelegramUser();
    navigate('/');
  };

  return (
    <div className="page">
      {/* Шапка профиля */}
      <div className="profile-header">
        <div className="profile-avatar">
          {userPhoto ? (
            <img src={userPhoto} alt={userName} className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{userName}</h2>
          <div className="profile-role">Администратор</div>
        </div>
        <button className="logout-button" onClick={handleLogout} title="Выйти">
          🚪
        </button>
      </div>

      {/* Карточки действий */}
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate('/admin/pages')}>
          <div className="card-icon">✏️</div>
          <div className="card-title">Редактор страниц</div>
          <div className="card-desc">Управление контентом</div>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/logs')}>
          <div className="card-icon">📋</div>
          <div className="card-title">Журнал действий</div>
          <div className="card-desc">Просмотр логов</div>
        </div>
      </div>
    </div>
  );
}