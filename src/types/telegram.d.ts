export {}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        MainButton: any
        openLink(url: string): unknown
        ready(): void
        expand(): void
        close(): void
        sendData(data: string): void
        initDataUnsafe: any
        themeParams: Record<string, string>
      }
    }
  }
}
