import { useNavigate } from 'react-router-dom'

export default function Tickets() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: 16 }}>
      <h1>🎟️ Билеты</h1>
      <p>Информация о проезде, тарифах и картах</p>

      <button onClick={() => navigate(-1)}>
        ← Назад
      </button>
    </div>
  )
}
