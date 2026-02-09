export default function Tickets() {
  return (
    <div className="page">
      <h1 className="page-title">🎟️ Билеты</h1>
      <p className="page-subtitle">
        Основная информация о проезде
      </p>

      <div className="list">
        <div className="card">
          <div className="card-title">💳 Карта «Тройка»</div>
          <div className="card-text">
            Как купить, пополнить и восстановить
          </div>
        </div>

        <div className="card">
          <div className="card-title">🎫 Разовые билеты</div>
          <div className="card-text">
            Тарифы и сроки действия
          </div>
        </div>

        <div className="card">
          <div className="card-title">👶 Льготы</div>
          <div className="card-text">
            Для студентов, пенсионеров
          </div>
        </div>
      </div>
    </div>
  )
}
