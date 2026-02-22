import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../utils/isAdmin';

export default function Home() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">🚇 Транспорт Москвы</h1>

      <div className="home-card">
        <div className="home-item" onClick={() => navigate('/tickets')}>
          <div className="home-item-icon">🎟️</div>
          <div className="home-item-text">
            <div className="home-item-title">Билеты</div>
            <div className="home-item-subtitle">Тройка, тарифы, льготы</div>
          </div>
        </div>

        <div className="home-item" onClick={() => navigate('/schedule')}>
          <div className="home-item-icon">⏱️</div>
          <div className="home-item-text">
            <div className="home-item-title">Расписание</div>
            <div className="home-item-subtitle">Метро, МЦД, МЦК</div>
          </div>
        </div>

        <div className="home-item" onClick={() => navigate('/rights')}>
          <div className="home-item-icon">⚖️</div>
          <div className="home-item-text">
            <div className="home-item-title">Права пассажира</div>
            <div className="home-item-subtitle">Контролёры и проверки</div>
          </div>
        </div>

        <div className="home-item" onClick={() => navigate('/fines')}>
          <div className="home-item-icon">💸</div>
          <div className="home-item-text">
            <div className="home-item-title">Штрафы</div>
            <div className="home-item-subtitle">За что и сколько</div>
          </div>
        </div>

        <div className="home-item" onClick={() => navigate('/about')}>
          <div className="home-item-icon">ℹ️</div>
          <div className="home-item-text">
            <div className="home-item-title">О проекте</div>
            <div className="home-item-subtitle">Контакты и источники</div>
          </div>
        </div>

        {/* Кнопка админки — видна только администраторам */}
        {admin && (
          <div className="home-item" onClick={() => navigate('/admin')}>
            <div className="home-item-icon">🛠️</div>
            <div className="home-item-text">
              <div className="home-item-title">Админка</div>
              <div className="home-item-subtitle">Управление страницами</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}