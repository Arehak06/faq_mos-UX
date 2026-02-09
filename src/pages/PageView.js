import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BlockRenderer } from '../components/BlockRenderer';
export default function PageView({ page }) {
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: page.title }), page.blocks.map((block) => (_jsx(BlockRenderer, { block: block }, block.id)))] }));
}
