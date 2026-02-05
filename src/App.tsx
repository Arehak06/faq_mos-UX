import { useEffect } from 'react'

declare global {
  interface Window {
    Telegram?: any
  }
}

function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    tg?.ready()
    tg?.expand()
  }, [])

  const sendToBot = () => {
    const tg = window.Telegram?.WebApp

    if (!tg) {
      alert('Откройте Mini App через Telegram')
      return
    }

    tg.sendData(
      JSON.stringify({
        action: 'open_section',
        section: 'tickets'
      })
    )

    tg.close()
  }

  return (
    <div className="container">
      <h1>🚇 FAQ транспорта Москвы</h1>

      <button onClick={sendToBot}>
        Перейти к билетам
      </button>
    </div>
  )
}

export default App
