export {}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
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
