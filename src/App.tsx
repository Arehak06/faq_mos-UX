import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Tickets from './pages/Tickets'
import Schedule from './pages/Schedule'
import Rights from './pages/Rights'
import Fines from './pages/Fines'
import About from './pages/About'
import Admin from './pages/Admin'
import AdminRoute from './components/AdminRoute'
import { useTelegramMainButton } from './hooks/useTelegramMainButton'

declare global {
  interface Window {
    Telegram?: any
  }
}

function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.ready()
    tg.expand()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/rights" element={<Rights />} />
      <Route path="/fines" element={<Fines />} />
      <Route path="/about" element={<About />} />

      {/* 🔒 Админка */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
    </Routes>
  )
}

export default App
