import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
export default function Home() {
    const navigate = useNavigate();
    return (_jsxs("div", { style: { padding: 16 }, children: [_jsx("h1", { children: "\uD83D\uDE87 FAQ \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0430" }), _jsx("p", { children: "\u041F\u043E\u043B\u0435\u0437\u043D\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u0434\u043B\u044F \u043F\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u043E\u0432" }), _jsx("button", { style: { padding: 12, width: '100%' }, onClick: () => navigate('/tickets'), children: "\uD83C\uDF9F\uFE0F \u0411\u0438\u043B\u0435\u0442\u044B \u0438 \u043F\u0440\u043E\u0435\u0437\u0434" })] }));
}
