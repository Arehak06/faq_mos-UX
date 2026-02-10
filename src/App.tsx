import { Routes, Route, useLocation } from 'react-router-dom'
import { loadPages } from './utils/storage'
import PageView from './pages/PageView'
import { usePageMainButton } from './hooks/usePageMainButton'

const pages = loadPages()

export default function App() {
  const location = useLocation()
  const key = location.pathname.replace('/', '') || 'home'
  const page = pages[key]

  usePageMainButton(page)

  return (
    <Routes>
      <Route path="/*" element={<PageView page={page} />} />
    </Routes>
  )
}
