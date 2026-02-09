import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import rawData from '../data/tickets.json';
import { BlockRenderer } from '../components/BlockRenderer';
const data = rawData;
export default function Tickets() {
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: data.title }), data.blocks.map((block, i) => (_jsx(BlockRenderer, { block: block }, i)))] }));
}
