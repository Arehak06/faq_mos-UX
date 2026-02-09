import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg)
            return;
        tg.ready();
        tg.expand();
    }, []);
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsx("h1", { children: "\uD83C\uDFE0 Home" }), _jsx("button", { onClick: () => navigate('/tickets'), children: "\uD83C\uDF9F\uFE0F \u041A \u0431\u0438\u043B\u0435\u0442\u0430\u043C" })] }));
}
