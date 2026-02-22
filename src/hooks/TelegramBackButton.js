import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
export function TelegramBackButton() {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        // Проверяем, поддерживается ли BackButton (версия Telegram >= 6.1)
        if (!tg?.BackButton)
            return;
        const isRoot = location.pathname === '/';
        if (isRoot) {
            tg.BackButton.hide();
            return;
        }
        tg.BackButton.show();
        const handler = () => navigate(-1);
        tg.BackButton.onClick(handler);
        return () => {
            tg.BackButton.offClick(handler);
        };
    }, [location.pathname, navigate]);
    return null;
}
