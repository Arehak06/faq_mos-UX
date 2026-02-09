import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        tg?.ready();
        tg?.expand();
    }, []);
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: "\uD83D\uDE87 \u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442 \u041C\u043E\u0441\u043A\u0432\u044B" }), _jsx("p", { className: "page-subtitle", children: "\u0411\u0438\u043B\u0435\u0442\u044B, \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438 \u043F\u043E\u043B\u0435\u0437\u043D\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F" }), _jsxs("div", { className: "list", children: [_jsxs("div", { className: "card", onClick: () => navigate('/tickets'), children: [_jsx("div", { className: "card-title", children: "\uD83C\uDF9F\uFE0F \u0411\u0438\u043B\u0435\u0442\u044B \u0438 \u043F\u0440\u043E\u0435\u0437\u0434" }), _jsx("div", { className: "card-text", children: "\u0422\u0440\u043E\u0439\u043A\u0430, \u0442\u0430\u0440\u0438\u0444\u044B, \u043B\u044C\u0433\u043E\u0442\u044B" })] }), _jsxs("div", { className: "card", children: [_jsx("div", { className: "card-title", children: "\u23F1\uFE0F \u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }), _jsx("div", { className: "card-text", children: "\u0410\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u043E\u0435 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0430" })] }), _jsxs("div", { className: "card", children: [_jsx("div", { className: "card-title", children: "\u2696\uFE0F \u041F\u0440\u0430\u0432\u0430 \u043F\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u0430" }), _jsx("div", { className: "card-text", children: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0438, \u0448\u0442\u0440\u0430\u0444\u044B, \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0451\u0440\u044B" })] })] })] }));
}
