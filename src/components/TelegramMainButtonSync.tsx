import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function TelegramMainButtonSync() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    const btn = tg.MainButton

    if (location.pathname === '/') {
      btn.hide()
      return
    }

    btn.setText('← Назад')
    btn.show()

    const onClick = () => navigate(-1)
    btn.onClick(onClick)

    return () => {
      btn.offClick(onClick)
    }
  }, [location.pathname, navigate])

  return null
}
