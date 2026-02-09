import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tickets from './pages/Tickets'
import TelegramMainButtonSync from './components/TelegramMainButtonSync'

function App() {
  return (
    <>
      <TelegramMainButtonSync />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tickets" element={<Tickets />} />
      </Routes>
    </>
  )
}

export default App
