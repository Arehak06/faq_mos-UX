import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import data from '../data/tickets.json';
export default function Tickets() {
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: data.title }), data.blocks.map((b, i) => (_jsx("p", { className: "text", children: b.value }, i)))] }));
}
