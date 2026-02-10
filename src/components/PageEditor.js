import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { reorder } from '../utils/reorder';
function uid() {
    return Math.random().toString(36).slice(2);
}
export default function PageEditor({ page, onChange }) {
    const [dragIndex, setDragIndex] = useState(null);
    const updateBlock = (i, block) => {
        const blocks = [...page.blocks];
        blocks[i] = block;
        onChange({ ...page, blocks });
    };
    return (_jsxs("div", { className: "editor", children: [_jsx("input", { value: page.title, onChange: (e) => onChange({ ...page, title: e.target.value }) }), page.blocks.map((b, i) => (_jsxs("div", { draggable: true, onDragStart: () => setDragIndex(i), onDragOver: (e) => e.preventDefault(), onDrop: () => {
                    if (dragIndex === null)
                        return;
                    onChange({
                        ...page,
                        blocks: reorder(page.blocks, dragIndex, i)
                    });
                }, children: [b.type === 'text' && (_jsx("textarea", { value: b.text, onChange: (e) => updateBlock(i, { ...b, text: e.target.value }) })), b.type === 'card' && (_jsxs(_Fragment, { children: [_jsx("input", { value: b.title, onChange: (e) => updateBlock(i, { ...b, title: e.target.value }) }), _jsx("textarea", { value: b.text, onChange: (e) => updateBlock(i, { ...b, text: e.target.value }) })] })), b.type === 'button' && (_jsxs(_Fragment, { children: [_jsx("input", { value: b.text, onChange: (e) => updateBlock(i, { ...b, text: e.target.value }) }), _jsx("input", { value: b.url, onChange: (e) => updateBlock(i, { ...b, url: e.target.value }) })] }))] }, b.id)))] }));
}
