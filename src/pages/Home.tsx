import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMainButton } from '../hooks/useMainButton'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    tg?.ready()
    tg?.expand()
  }, [])

  useMainButton('', () => {}, false) // скрыть кнопку

  return (
    <div style={{ padding: 16 }}>
      <h1>🏠 Главная</h1>

      <button onClick={() => navigate('/tickets')}>
        🎟️ Билеты
      </button>
    </div>
  )
}
