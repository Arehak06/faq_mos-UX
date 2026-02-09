import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TgCard } from './TgCard';
export function BlockRenderer({ block }) {
    switch (block.type) {
        case 'text':
            return (_jsx(TgCard, { children: _jsx("p", { children: block.value }) }));
        case 'list':
            return (_jsx(TgCard, { children: _jsx("ul", { className: "tg-list", children: block.items.map((item, i) => (_jsx("li", { children: item }, i))) }) }));
        case 'warning':
            return (_jsxs("div", { className: "tg-warning", children: ["\u26A0\uFE0F ", block.value] }));
        case 'button':
            return (_jsx("button", { className: "tg-button", onClick: () => window.open(block.url, '_blank'), children: block.text }));
    }
}
