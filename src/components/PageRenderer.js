import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
export default function PageRenderer({ page }) {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: page.title }), _jsx("div", { className: "list", children: page.blocks.map((b) => {
                    if (b.type === 'text') {
                        return (_jsx("p", { className: "text", children: b.value }, b.id));
                    }
                    if (b.type === 'card') {
                        return (_jsxs("div", { className: "card", onClick: () => b.to && navigate(b.to), children: [_jsx("div", { className: "card-title", children: b.title }), _jsx("div", { className: "card-text", children: b.text })] }, b.id));
                    }
                    return null;
                }) })] }));
}
