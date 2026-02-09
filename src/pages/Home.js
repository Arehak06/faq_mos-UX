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
    return (_jsxs("div", { style: { padding: 16 }, children: [_jsx("h1", { children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }), _jsx("button", { onClick: () => navigate('/tickets'), children: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0431\u0438\u043B\u0435\u0442\u0430\u043C" })] }));
}
