import { useEffect } from 'react'
import { PageData } from '../types/page'

export function usePageMainButton(page?: PageData) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg || !page?.mainButton) {
      tg?.MainButton.hide()
      return
    }

    tg.MainButton.setText(page.mainButton.text)
    tg.MainButton.show()

    tg.MainButton.onClick(() => {
      const action = page.mainButton!.action

      if (action.type === 'link') {
        window.open(action.value, '_blank')
      } else {
        window.location.hash = action.value
      }
    })

    return () => tg.MainButton.offClick()
  }, [page])
}
