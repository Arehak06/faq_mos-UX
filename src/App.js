import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
function App() {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        tg?.ready();
        tg?.expand();
    }, []);
    const sendToBot = () => {
        window.Telegram?.WebApp.sendData(JSON.stringify({
            section: 'tickets',
            from: 'miniapp'
        }));
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h1", { children: "\uD83D\uDE87 FAQ \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0430 \u041C\u043E\u0441\u043A\u0432\u044B" }), _jsx("button", { onClick: sendToBot, children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0432 \u0431\u043E\u0442\u0430" })] }));
}
export default App;
