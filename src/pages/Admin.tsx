import { useNavigate } from 'react-router-dom'
import { getTelegramUser } from '../utils/isAdmin'

export default function Admin() {
  const navigate = useNavigate()
  const user = getTelegramUser()

  return (
    <div className="page">
      <h1>🛠 Админ-панель</h1>

      {user && (
        <p>
          Вы вошли как <strong>{user.first_name}</strong>
        </p>
      )}

      <div className="card">
        ✏️ Редактор страниц (скоро)
      </div>

      <div className="card">
        📊 Управление контентом
      </div>

      <button onClick={() => navigate('/')}>
        ⬅️ На главную
      </button>
    </div>
  )
}
