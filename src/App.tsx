import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tickets from './pages/Tickets'
import Schedule from './pages/Schedule'
import Rights from './pages/Rights'
import Fines from './pages/Fines'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/rights" element={<Rights />} />
      <Route path="/fines" element={<Fines />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
