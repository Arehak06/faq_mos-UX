import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.ready()
    tg.expand()
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h1>Главная</h1>

      <button onClick={() => navigate('/tickets')}>
        Перейти к билетам
      </button>
    </div>
  )
}
