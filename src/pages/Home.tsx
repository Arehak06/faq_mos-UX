import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: 16 }}>
      <h1>🚇 FAQ транспорта</h1>
      <p>Полезная информация для пассажиров</p>

      <button
        style={{ padding: 12, width: '100%' }}
        onClick={() => navigate('/tickets')}
      >
        🎟️ Билеты и проезд
      </button>
    </div>
  )
}
