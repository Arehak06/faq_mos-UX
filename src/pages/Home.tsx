import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const tg = window.Telegram?.WebApp

  const openTickets = () => {
    if (!tg) return

    // вариант 1 — переход внутри WebApp
    navigate('/tickets')

    // вариант 2 — если нужно сообщить боту
    tg.sendData(
      JSON.stringify({
        action: 'open_section',
        section: 'tickets'
      })
    )
  }

  return (
    <div
      style={{
        background: 'white',
        color: 'black',
        minHeight: '100vh',
        padding: 20
      }}
    >
      <h1>🚇 FAQ транспорта</h1>

      <button onClick={openTickets}>
        🎟️ Билеты и проезд
      </button>

      <br /><br />

      <button onClick={() => tg?.close()}>
        Закрыть WebApp
      </button>
    </div>
  )
}
