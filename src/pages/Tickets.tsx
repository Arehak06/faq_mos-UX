import { useNavigate } from 'react-router-dom'
import { useMainButton } from '../hooks/useMainButton'

export default function Tickets() {
  const navigate = useNavigate()

  useMainButton('← Назад', () => navigate(-1))

  return (
    <div style={{ padding: 16 }}>
      <h1>🎟️ Билеты</h1>
      <p>Информация о проезде</p>
    </div>
  )
}
