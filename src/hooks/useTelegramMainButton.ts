type TelegramMainButtonOptions = {
  text: string
  onClick: () => void
  visible?: boolean
}

export function useTelegramMainButton({
  text,
  onClick,
  visible = true
}: TelegramMainButtonOptions) {
  const tg = window.Telegram?.WebApp

  if (!tg) return

  tg.MainButton.setText(text)

  if (visible) {
    tg.MainButton.show()
  } else {
    tg.MainButton.hide()
  }

  tg.MainButton.offClick(onClick)
  tg.MainButton.onClick(onClick)
}
