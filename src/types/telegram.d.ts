export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        MainButton: {
          setText(text: string): void;
          show(): void;
          hide(): void;
          onClick(cb: () => void): void;
          offClick(cb?: () => void): void;
          setParams(params: {
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_progress_visible?: boolean;
          }): void;
        };
        BackButton: {
          show(): void;
          hide(): void;
          onClick(cb: () => void): void;
          offClick(cb?: () => void): void;
        };
        openLink(url: string): void;
        ready(): void;
        expand(): void;
        close(): void;
        sendData(data: string): void;
        initDataUnsafe: any;
        themeParams: Record<string, string>;
      };
    };
  }
}