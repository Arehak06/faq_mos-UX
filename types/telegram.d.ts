export {}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: any
        expand: () => void
        close: () => void
        ready: () => void
        sendData: (data: string) => void
        themeParams: Record<string, string>
      }
    }
  }
}
