import { useNavigate } from 'react-router-dom'

export default function Tickets() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: 20 }}>
      <h1>🎟️ Tickets</h1>

      <button onClick={() => navigate(-1)}>
        ← Назад
      </button>
    </div>
  )
}
