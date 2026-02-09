import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
export default function Tickets() {
    const navigate = useNavigate();
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsx("h1", { children: "\uD83C\uDF9F\uFE0F Tickets" }), _jsx("button", { onClick: () => navigate(-1), children: "\u2190 \u041D\u0430\u0437\u0430\u0434" })] }));
}
