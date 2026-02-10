import { useEffect } from 'react';
export function usePageMainButton(mainButton) {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg)
            return;
        if (!mainButton) {
            tg.MainButton.hide();
            return;
        }
        tg.MainButton.setText(mainButton.text);
        tg.MainButton.show();
        const handler = () => {
            if (mainButton.action.type === 'link') {
                window.open(mainButton.action.value, '_blank');
            }
            if (mainButton.action.type === 'route') {
                window.location.hash = mainButton.action.value;
            }
        };
        tg.MainButton.offClick(handler);
        tg.MainButton.onClick(handler);
        return () => {
            tg.MainButton.offClick(handler);
        };
    }, [mainButton]);
}
