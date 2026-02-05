import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    tg?.ready()
    tg?.expand()
  }, [])

  const sendToBot = () => {
    window.Telegram?.WebApp.sendData(
      JSON.stringify({
        section: 'tickets',
        from: 'miniapp'
      })
    )
  }

  return (
    <div className="container">
      <h1>🚇 FAQ транспорта Москвы</h1>

      <button onClick={sendToBot}>
        Отправить данные в бота
      </button>
    </div>
  )
}

export default App
