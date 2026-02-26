import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../utils/isAdmin';

export default function Home() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  const mainSections = [
    { path: '/tickets', icon: '🎟️', title: 'Билеты', subtitle: 'Тройка, тарифы, льготы' },
    { path: '/schedule', icon: '⏱️', title: 'Расписание', subtitle: 'Метро, МЦД, МЦК' },
    { path: '/rights', icon: '⚖️', title: 'Права пассажира', subtitle: 'Контролёры и проверки' },
    { path: '/fines', icon: '💸', title: 'Штрафы', subtitle: 'За что и сколько' },
    { path: '/about', icon: 'ℹ️', title: 'О проекте', subtitle: 'Контакты и источники' },
  ];

  const adminSections = [
    { path: '/admin', icon: '🛠️', title: 'Админка', subtitle: 'Управление страницами' },
    { path: '/logs', icon: '📋', title: 'Журнал', subtitle: 'Действия администраторов' },
  ];

  return (
    <div className="page">
      <h1 className="page-title">🚇 Транспорт Москвы</h1>

      {/* Основные разделы */}
      <div className="home-section-title">Справочник</div>
      <div className="home-card">
        {mainSections.map((section) => (
          <div
            key={section.path}
            className="home-item"
            onClick={() => navigate(section.path)}
          >
            <div className="home-item-icon">{section.icon}</div>
            <div className="home-item-text">
              <div className="home-item-title">{section.title}</div>
              <div className="home-item-subtitle">{section.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Административные разделы (только для админов) */}
      {admin && (
        <>
          <div className="home-section-title home-admin-section">Управление</div>
          <div className="home-card">
            {adminSections.map((section) => (
              <div
                key={section.path}
                className="home-item"
                onClick={() => navigate(section.path)}
              >
                <div className="home-item-icon">{section.icon}</div>
                <div className="home-item-text">
                  <div className="home-item-title">{section.title}</div>
                  <div className="home-item-subtitle">{section.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}