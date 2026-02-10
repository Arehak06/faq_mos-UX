import { useEffect } from 'react'

type Options = {
  text: string
  onClick: () => void
  visible?: boolean
}

export function useTelegramMainButton({
  text,
  onClick,
  visible = true
}: Options) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    const btn = tg.MainButton

    if (!visible) {
      btn.hide()
      return
    }

    btn.setText(text)
    btn.show()

    btn.onClick(onClick)

    return () => {
      btn.offClick(onClick)
    }
  }, [text, onClick, visible])
}
