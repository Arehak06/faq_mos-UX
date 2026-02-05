import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Home() {
    const openSection = (section) => {
        const tg = window.Telegram?.WebApp;
        if (!tg)
            return;
        tg.sendData(JSON.stringify({
            action: 'open_section',
            section
        }));
        tg.close();
    };
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "header", children: [_jsx("h1", { children: "\uD83D\uDE87 FAQ \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0430 \u041C\u043E\u0441\u043A\u0432\u044B" }), _jsx("p", { children: "\u0411\u0438\u043B\u0435\u0442\u044B, \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438 \u043F\u043E\u043B\u0435\u0437\u043D\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F" })] }), _jsxs("div", { className: "cards", children: [_jsx(Card, { title: "\uD83C\uDF9F\uFE0F \u0411\u0438\u043B\u0435\u0442\u044B \u0438 \u043F\u0440\u043E\u0435\u0437\u0434", text: "\u0422\u0440\u043E\u0439\u043A\u0430, \u0421\u0442\u0440\u0435\u043B\u043A\u0430, \u0442\u0430\u0440\u0438\u0444\u044B \u0438 \u043B\u044C\u0433\u043E\u0442\u044B", onClick: () => openSection('tickets') }), _jsx(Card, { title: "\u23F1\uFE0F \u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435", text: "\u0410\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u043E\u0435 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u043F\u043E\u0435\u0437\u0434\u043E\u0432", onClick: () => openSection('schedule') }), _jsx(Card, { title: "\u2696\uFE0F \u042E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0440\u0430\u0437\u0434\u0435\u043B", text: "\u041F\u0440\u0430\u0432\u0430 \u043F\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u0430 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438", onClick: () => openSection('law') }), _jsx(Card, { title: "\uD83D\uDE86 \u041F\u0440\u043E \u043F\u043E\u0435\u0437\u0434\u0430 \u0438 \u0430\u0432\u0442\u043E\u0431\u0443\u0441\u044B", text: "\u0414\u043B\u044F \u0444\u0430\u043D\u0430\u0442\u043E\u0432 \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0430", onClick: () => openSection('trains') })] }), _jsx("button", { className: "secondary", onClick: () => openSection('feedback'), children: "\uD83D\uDCDD \u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435" })] }));
}
function Card({ title, text, onClick }) {
    return (_jsxs("div", { className: "card", onClick: onClick, children: [_jsx("h2", { children: title }), _jsx("p", { children: text })] }));
}
