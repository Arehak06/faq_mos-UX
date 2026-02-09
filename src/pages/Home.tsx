import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    tg?.ready()
    tg?.expand()
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">🚇 Транспорт Москвы</h1>
      <p className="page-subtitle">
        Билеты, расписание и полезная информация
      </p>

      <div className="list">
        <div className="card" onClick={() => navigate('/tickets')}>
          <div className="card-title">🎟️ Билеты и проезд</div>
          <div className="card-text">
            Тройка, тарифы, льготы
          </div>
        </div>

        <div className="card">
          <div className="card-title">⏱️ Расписание</div>
          <div className="card-text">
            Актуальное движение транспорта
          </div>
        </div>

        <div className="card">
          <div className="card-title">⚖️ Права пассажира</div>
          <div className="card-text">
            Проверки, штрафы, контролёры
          </div>
        </div>
      </div>
    </div>
  )
}
