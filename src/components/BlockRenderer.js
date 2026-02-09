import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TgCard } from './TgCard';
import { useNavigate } from 'react-router-dom';
export function BlockRenderer({ block }) {
    const navigate = useNavigate();
    if (block.type === 'text') {
        return (_jsx(TgCard, { children: _jsx("p", { children: block.text }) }));
    }
    if (block.type === 'card') {
        return (_jsxs(TgCard, { children: ["\u043F", _jsx("div", { className: "card-title", children: block.title }), _jsx("div", { className: "card-text", children: block.text })] }));
    }
    if (block.type === 'button') {
        return (_jsx("button", { className: "tg-button", onClick: () => {
                if (block.url.startsWith('http')) {
                    window.open(block.url, '_blank');
                }
                else {
                    navigate(block.url);
                }
            }, children: block.text }));
    }
    return null;
}
