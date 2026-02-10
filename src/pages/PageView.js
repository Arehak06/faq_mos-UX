import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BlockRenderer } from '../components/BlockRenderer';
import { usePageMainButton } from '../hooks/usePageMainButton';
export default function PageView({ page }) {
    usePageMainButton(page.mainButton);
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: page.title }), page.blocks.map((block) => (_jsx(BlockRenderer, { block: block }, block.id)))] }));
}
