import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function PageView({ page }) {
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: page.title }), page.blocks.map((b) => {
                if (b.type === 'text') {
                    return (_jsx("p", { children: b.text }, b.id));
                }
                if (b.type === 'card') {
                    return (_jsxs("div", { className: "card", children: [_jsx("div", { className: "card-title", children: b.title }), _jsx("div", { className: "card-text", children: b.text })] }, b.id));
                }
                if (b.type === 'button') {
                    return (_jsx("button", { className: "tg-button", onClick: () => {
                            if (b.url.startsWith('http')) {
                                window.open(b.url, '_blank');
                            }
                            else {
                                window.location.hash = b.url;
                            }
                        }, children: b.text }, b.id));
                }
                return null;
            })] }));
}
