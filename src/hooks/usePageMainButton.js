import { useEffect, useRef } from 'react';
export function usePageMainButton(mainButton) {
    const handlerRef = useRef(null);
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg || !tg.MainButton)
            return;
        // если кнопки нет — просто скрываем
        if (!mainButton) {
            tg.MainButton.hide();
            return;
        }
        tg.MainButton.setText(mainButton.text);
        tg.MainButton.show();
        // удаляем старый handler
        if (handlerRef.current) {
            tg.MainButton.offClick(handlerRef.current);
        }
        const handler = () => {
            if (mainButton.action.type === 'link') {
                window.open(mainButton.action.value, '_blank');
            }
            if (mainButton.action.type === 'route') {
                window.location.hash = mainButton.action.value;
            }
        };
        handlerRef.current = handler;
        tg.MainButton.onClick(handler);
        return () => {
            if (handlerRef.current) {
                tg.MainButton.offClick(handlerRef.current);
                handlerRef.current = null;
            }
        };
    }, [mainButton]);
}
