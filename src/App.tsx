import { Routes, Route } from 'react-router-dom'
import Page from './pages/Page'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="/:slug" element={<Page />} />
    </Routes>
  )
}
