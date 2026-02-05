import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
export default function Tickets() {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "app", children: [_jsx("button", { className: "secondary", onClick: () => navigate('/'), children: "\u2190 \u041D\u0430\u0437\u0430\u0434" }), _jsx("h1", { children: "\uD83C\uDF9F\uFE0F \u0411\u0438\u043B\u0435\u0442\u044B \u0438 \u043F\u0440\u043E\u0435\u0437\u0434" }), _jsx("p", { children: "\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0431\u0438\u043B\u0435\u0442\u0430\u0445, \u0422\u0440\u043E\u0439\u043A\u0435 \u0438 \u043B\u044C\u0433\u043E\u0442\u0430\u0445" })] }));
}
