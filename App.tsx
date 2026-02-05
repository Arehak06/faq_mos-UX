import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    tg?.ready()
    tg?.expand()
  }, [])

  const sendData = () => {
    window.Telegram?.WebApp.sendData(
      JSON.stringify({
        action: 'open_article',
        page: 'tickets'
      })
    )
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>🚇 FAQ транспорта Москвы</h2>
      <button onClick={sendData}>
        Отправить данные в бота
      </button>
    </div>
  )
}

export default App
