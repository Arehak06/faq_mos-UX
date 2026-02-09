import { useEffect } from 'react';
export function useMainButton(text, onClick, visible = true) {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg)
            return;
        const btn = tg.MainButton;
        btn.setText(text);
        visible ? btn.show() : btn.hide();
        btn.onClick(onClick);
        return () => {
            btn.offClick(onClick);
        };
    }, [text, onClick, visible]);
}
