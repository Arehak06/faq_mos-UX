import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tickets from './pages/Tickets'

function App() {
useEffect(() => {
  const tg = window.Telegram?.WebApp
  alert(tg ? 'TELEGRAM WEBAPP' : 'BROWSER')
}, [])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tickets" element={<Tickets />} />
    </Routes>
  )
}

export default App
