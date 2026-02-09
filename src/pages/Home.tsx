import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { isAdmin } from '../utils/isAdmin'

const ADMINS = [
  8530682852
]

export default function Home() {
  const navigate = useNavigate()
  const [editMode, setEditMode] = useState(false)

  const tg = window.Telegram?.WebApp
  const user = tg?.initDataUnsafe?.user

  const isAdmin = !!user?.id && ADMINS.includes(user.id)

  return (
    <div className="page">
      {/* Заголовок */}
      <h1 className="page-title">🚇 Билетик - справочник по транспорту по Москве и области</h1>
      <p className="page-subtitle">Пожалуй, лучший справочник по транспорту...</p>

      {/* Админ-панель */}
      {isAdmin && (
  <div
    className="card admin-entry"
    onClick={() => navigate('/admin')}
  >
    🛠 Админ-панель
  </div>
)}

      {/* Контент */}
      {!editMode ? (
        <div className="list">
          <div className="card" onClick={() => navigate('/tickets')}>
            <div className="card-title">🎟️ Билеты</div>
            <div className="card-text">Тройка, тарифы, льготы</div>
          </div>

          <div className="card" onClick={() => navigate('/schedule')}>
            <div className="card-title">⏱️ Расписание</div>
            <div className="card-text">Метро, МЦД, МЦК</div>
          </div>

          <div className="card" onClick={() => navigate('/rights')}>
            <div className="card-title">⚖️ Права пассажира</div>
            <div className="card-text">Контролёры и проверки</div>
          </div>

          <div className="card" onClick={() => navigate('/fines')}>
            <div className="card-title">💸 Штрафы</div>
            <div className="card-text">За что и сколько</div>
          </div>

          <div className="card" onClick={() => navigate('/about')}>
            <div className="card-title">ℹ️ О проекте</div>
            <div className="card-text">Контакты и источники</div>
          </div>
        </div>
      ) : (
        <div className="editor">
          <h3>✏️ Режим редактирования</h3>
          <p>Здесь будет редактор страниц</p>

          <div className="card muted">
            (MVP) Пока только визуальный режим
          </div>
        </div>
      )}
    </div>
  )
}
