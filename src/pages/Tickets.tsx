import { useNavigate } from 'react-router-dom'

export default function Tickets() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <button className="secondary" onClick={() => navigate('/')}>
        ← Назад
      </button>

      <h1>🎟️ Билеты и проезд</h1>

      <p>Информация о билетах, Тройке и льготах</p>
    </div>
  )
}
