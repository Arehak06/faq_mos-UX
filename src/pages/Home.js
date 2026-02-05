import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
export default function Home() {
    const navigate = useNavigate();
    const tg = window.Telegram?.WebApp;
    const openTickets = () => {
        if (!tg)
            return;
        // вариант 1 — переход внутри WebApp
        navigate('/tickets');
        // вариант 2 — если нужно сообщить боту
        tg.sendData(JSON.stringify({
            action: 'open_section',
            section: 'tickets'
        }));
    };
    return (_jsxs("div", { style: {
            background: 'white',
            color: 'black',
            minHeight: '100vh',
            padding: 20
        }, children: [_jsx("h1", { children: "\uD83D\uDE87 FAQ \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0430" }), _jsx("button", { onClick: openTickets, children: "\uD83C\uDF9F\uFE0F \u0411\u0438\u043B\u0435\u0442\u044B \u0438 \u043F\u0440\u043E\u0435\u0437\u0434" }), _jsx("br", {}), _jsx("br", {}), _jsx("button", { onClick: () => tg?.close(), children: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C WebApp" })] }));
}
