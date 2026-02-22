import { useEffect } from 'react';

export function useTelegramBackButton(visible: boolean, onClose?: () => void) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    if (visible) tg.BackButton.show();
    else tg.BackButton.hide();

    const handler = onClose || (() => tg.close());
    tg.BackButton.onClick(handler);

    return () => {
      tg.BackButton.offClick(handler);
    };
  }, [visible, onClose]);
}