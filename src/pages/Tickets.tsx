import { useNavigate } from 'react-router-dom'

export default function Tickets() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: 16 }}>
      <h1>🎟️ Билеты</h1>

      <button onClick={() => navigate(-1)}>
        ← Назад
      </button>
    </div>
  )
}
