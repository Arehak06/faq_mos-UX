import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { reorder } from '../utils/reorder';
import { useState } from 'react';
function uid() {
    return Math.random().toString(36).slice(2);
}
export default function PageEditor({ page, onChange }) {
    const addTextBlock = () => {
        const block = {
            id: uid(),
            type: 'text',
            text: ''
        };
        onChange({ ...page, blocks: [...page.blocks, block] });
    };
    const addCardBlock = () => {
        const block = {
            id: uid(),
            type: 'card',
            title: '',
            text: ''
        };
        onChange({ ...page, blocks: [...page.blocks, block] });
    };
    const addButtonBlock = () => {
        const block = {
            id: uid(),
            type: 'button',
            text: '',
            url: ''
        };
        onChange({ ...page, blocks: [...page.blocks, block] });
    };
    const removeBlock = (index) => {
        onChange({
            ...page,
            blocks: page.blocks.filter((_, i) => i !== index)
        });
    };
    const updateBlock = (index, block) => {
        const blocks = [...page.blocks];
        blocks[index] = block;
        onChange({ ...page, blocks });
    };
    const [dragIndex, setDragIndex] = useState(null);
    return (_jsxs("div", { className: "editor", children: [_jsxs("label", { className: "editor-field", children: [_jsx("span", { children: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B" }), _jsx("input", { value: page.title, onChange: (e) => onChange({ ...page, title: e.target.value }) })] }), _jsx("h3", { children: "\u0411\u043B\u043E\u043A\u0438" }), page.blocks.map((b, i) => (_jsxs("div", { className: "editor-block", draggable: true, onDragStart: () => setDragIndex(i), onDragOver: (e) => e.preventDefault(), onDrop: () => {
                    if (dragIndex === null || dragIndex === i)
                        return;
                    const blocks = reorder(page.blocks, dragIndex, i);
                    onChange({ ...page, blocks });
                    setDragIndex(null);
                }, children: [_jsxs("div", { className: "editor-block-header", children: [_jsx("strong", { children: b.type }), _jsx("button", { className: "danger", onClick: () => removeBlock(i), children: "\uD83D\uDDD1" })] }), b.type === 'text' && (_jsx("textarea", { value: b.text, placeholder: "\u0422\u0435\u043A\u0441\u0442 \u0431\u043B\u043E\u043A\u0430", onChange: (e) => updateBlock(i, {
                            ...b,
                            text: e.target.value
                        }) })), b.type === 'card' && (_jsxs(_Fragment, { children: [_jsx("input", { value: b.title, placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438", onChange: (e) => updateBlock(i, {
                                    ...b,
                                    title: e.target.value
                                }) }), _jsx("textarea", { value: b.text, placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438", onChange: (e) => updateBlock(i, {
                                    ...b,
                                    text: e.target.value
                                }) })] })), b.type === 'button' && (_jsxs(_Fragment, { children: [_jsx("input", { value: b.text, placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043A\u043D\u043E\u043F\u043A\u0438", onChange: (e) => updateBlock(i, {
                                    ...b,
                                    text: e.target.value
                                }) }), _jsx("input", { value: b.url, placeholder: "\u0421\u0441\u044B\u043B\u043A\u0430 (https:// \u0438\u043B\u0438 /page)", onChange: (e) => updateBlock(i, {
                                    ...b,
                                    url: e.target.value
                                }) })] }))] }, b.id))), _jsxs("div", { className: "editor-actions", children: [_jsx("button", { onClick: addTextBlock, children: "\u2795 \u0422\u0435\u043A\u0441\u0442" }), _jsx("button", { onClick: addCardBlock, children: "\u2795 \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430" }), _jsx("button", { onClick: addButtonBlock, children: "\u2795 \u041A\u043D\u043E\u043F\u043A\u0430" })] })] }));
}
