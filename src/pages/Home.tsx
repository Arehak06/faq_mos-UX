import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <h1 className="page-title">🚇 Транспорт Москвы</h1>
      <p className="page-subtitle">Справочник пассажира</p>

      <div className="list">
        <div className="card" onClick={() => navigate('/tickets')}>
          <div className="card-title">🎟️ Билеты</div>
          <div className="card-text">Тройка, тарифы, льготы</div>
        </div>

        <div className="card" onClick={() => navigate('/schedule')}>
          <div className="card-title">⏱️ Расписание</div>
          <div className="card-text">Метро, МЦД, МЦК</div>
        </div>

        <div className="card" onClick={() => navigate('/rights')}>
          <div className="card-title">⚖️ Права пассажира</div>
          <div className="card-text">Контролёры и проверки</div>
        </div>

        <div className="card" onClick={() => navigate('/fines')}>
          <div className="card-title">💸 Штрафы</div>
          <div className="card-text">За что и сколько</div>
        </div>

        <div className="card" onClick={() => navigate('/about')}>
          <div className="card-title">ℹ️ О проекте</div>
          <div className="card-text">Контакты и источники</div>
        </div>
      </div>
    </div>
  )
}
