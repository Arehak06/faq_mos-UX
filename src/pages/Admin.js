import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { getTelegramUser } from '../utils/isAdmin';
export default function Admin() {
    const navigate = useNavigate();
    const user = getTelegramUser();
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { children: "\uD83D\uDEE0 \u0410\u0434\u043C\u0438\u043D-\u043F\u0430\u043D\u0435\u043B\u044C" }), user && (_jsxs("p", { children: ["\u0412\u044B \u0432\u043E\u0448\u043B\u0438 \u043A\u0430\u043A ", _jsx("strong", { children: user.first_name })] })), _jsx("div", { className: "card", children: "\u270F\uFE0F \u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0441\u0442\u0440\u0430\u043D\u0438\u0446 (\u0441\u043A\u043E\u0440\u043E)" }), _jsx("div", { className: "card", children: "\uD83D\uDCCA \u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u043E\u043C" }), _jsx("button", { onClick: () => navigate('/'), children: "\u2B05\uFE0F \u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E" })] }));
}
