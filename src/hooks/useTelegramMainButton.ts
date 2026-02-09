import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useTelegramMainButton(options?: {
  text?: string
  onClick?: () => void
  visible?: boolean
}) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.MainButton.hide()
    tg.MainButton.offClick(() => {})

    if (options?.visible === false) return

    // кастомная кнопка
    if (options?.text && options?.onClick) {
      tg.MainButton.setText(options.text)
      tg.MainButton.show()
      tg.MainButton.onClick(options.onClick)
      return
    }

    // кнопка "Назад"
    if (location.pathname !== '/') {
      tg.MainButton.setText('⬅️ Назад')
      tg.MainButton.show()
      tg.MainButton.onClick(() => navigate(-1))
    }
  }, [location.pathname])
}
