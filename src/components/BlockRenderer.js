import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TgCard } from './TgCard';
export function BlockRenderer({ block }) {
    switch (block.type) {
        case 'text':
            return (_jsx(TgCard, { children: _jsx("p", { children: block.text }) }));
        case 'card':
            return (_jsxs(TgCard, { children: [_jsx("h3", { children: block.title }), _jsx("p", { children: block.text })] }));
        case 'button':
            return (_jsx("button", { className: "tg-button", onClick: () => {
                    if (block.url.startsWith('http')) {
                        window.open(block.url, '_blank');
                    }
                    else {
                        window.location.hash = block.url;
                    }
                }, children: block.text }));
    }
}
