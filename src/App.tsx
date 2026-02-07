import { useEffect } from 'react'
import './app.css'

function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.ready()
    tg.expand()
  }, [])

  const openSection = (section: string) => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.sendData(
      JSON.stringify({
        action: 'open_section',
        section
      })
    )

    tg.close()
  }

  const openLink = (url: string) => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.openLink(url)
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚇 FAQ транспорта Москвы</h1>
        <p>Билеты, расписание и полезная информация</p>
      </header>

      <div className="cards">
        <Card
          title="🎟️ Билеты и проезд"
          text="Тройка, Стрелка, тарифы и льготы"
          onClick={() => openSection('tickets')}
        />

        <Card
          title="⏱️ Расписание и движение"
          text="Актуальное движение поездов"
          onClick={() => openSection('schedule')}
        />

        <Card
          title="⚖️ Юридический раздел"
          text="Права пассажира и проверки"
          onClick={() => openSection('law')}
        />

        <Card
          title="🚆 Про поезда и автобусы"
          text="Для фанатов транспорта"
          onClick={() => openSection('trains')}
        />
      </div>

      <button
        className="secondary"
        onClick={() => openLink('https://mosmetro.ru')}
      >
        📝 Сообщить об ошибке
      </button>
    </div>
  )
}

function Card({
  title,
  text,
  onClick
}: {
  title: string
  text: string
  onClick: () => void
}) {
  return (
    <div className="card" onClick={onClick}>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

export default App
