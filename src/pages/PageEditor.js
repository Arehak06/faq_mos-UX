import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { reorder } from '../utils/reorder';
function uid() {
    return Math.random().toString(36).slice(2);
}
export default function PageEditor({ page, onChange }) {
    const [dragIndex, setDragIndex] = useState(null);
    /* ---------- blocks ---------- */
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
    /* ---------- main button ---------- */
    const toggleMainButton = (enabled) => {
        if (enabled) {
            onChange({
                ...page,
                mainButton: {
                    text: 'Далее',
                    action: {
                        type: 'route',
                        value: '/'
                    }
                }
            });
        }
        else {
            const { mainButton, ...rest } = page;
            onChange(rest);
        }
    };
    return (_jsxs("div", { className: "editor", children: [_jsxs("label", { className: "editor-field", children: [_jsx("span", { children: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B" }), _jsx("input", { value: page.title, onChange: (e) => onChange({ ...page, title: e.target.value }) })] }), _jsx("h3", { children: "Telegram MainButton" }), _jsxs("label", { className: "editor-field checkbox", children: [_jsx("input", { type: "checkbox", checked: !!page.mainButton, onChange: (e) => toggleMainButton(e.target.checked) }), _jsx("span", { children: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443" })] }), page.mainButton && (_jsxs("div", { className: "editor-mainbutton", children: [_jsxs("label", { className: "editor-field", children: [_jsx("span", { children: "\u0422\u0435\u043A\u0441\u0442 \u043A\u043D\u043E\u043F\u043A\u0438" }), _jsx("input", { value: page.mainButton.text, onChange: (e) => onChange({
                                    ...page,
                                    mainButton: {
                                        ...page.mainButton,
                                        text: e.target.value
                                    }
                                }) })] }), _jsxs("label", { className: "editor-field", children: [_jsx("span", { children: "\u0422\u0438\u043F \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }), _jsxs("select", { value: page.mainButton.action.type, onChange: (e) => onChange({
                                    ...page,
                                    mainButton: {
                                        ...page.mainButton,
                                        action: {
                                            ...page.mainButton.action,
                                            type: e.target.value
                                        }
                                    }
                                }), children: [_jsx("option", { value: "route", children: "\u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u0432\u043D\u0443\u0442\u0440\u0438" }), _jsx("option", { value: "link", children: "\u0412\u043D\u0435\u0448\u043D\u044F\u044F \u0441\u0441\u044B\u043B\u043A\u0430" })] })] }), _jsxs("label", { className: "editor-field", children: [_jsx("span", { children: "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435" }), _jsx("input", { placeholder: page.mainButton.action.type === 'route'
                                    ? '/tickets'
                                    : 'https://...', value: page.mainButton.action.value, onChange: (e) => onChange({
                                    ...page,
                                    mainButton: {
                                        ...page.mainButton,
                                        action: {
                                            ...page.mainButton.action,
                                            value: e.target.value
                                        }
                                    }
                                }) })] })] })), _jsx("h3", { children: "\u0411\u043B\u043E\u043A\u0438" }), page.blocks.map((b, i) => (_jsxs("div", { className: "editor-block", draggable: true, onDragStart: () => setDragIndex(i), onDragOver: (e) => e.preventDefault(), onDrop: () => {
                    if (dragIndex === null || dragIndex === i)
                        return;
                    const blocks = reorder(page.blocks, dragIndex, i);
                    onChange({ ...page, blocks });
                    setDragIndex(null);
                }, children: [_jsxs("div", { className: "editor-block-header", children: [_jsx("strong", { children: b.type }), _jsx("button", { className: "danger", onClick: () => removeBlock(i), children: "\uD83D\uDDD1" })] }), b.type === 'text' && (_jsx("textarea", { value: b.text, placeholder: "\u0422\u0435\u043A\u0441\u0442 \u0431\u043B\u043E\u043A\u0430", onChange: (e) => updateBlock(i, { ...b, text: e.target.value }) })), b.type === 'card' && (_jsxs(_Fragment, { children: [_jsx("input", { value: b.title, placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438", onChange: (e) => updateBlock(i, { ...b, title: e.target.value }) }), _jsx("textarea", { value: b.text, placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438", onChange: (e) => updateBlock(i, { ...b, text: e.target.value }) })] })), b.type === 'button' && (_jsxs(_Fragment, { children: [_jsx("input", { value: b.text, placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043A\u043D\u043E\u043F\u043A\u0438", onChange: (e) => updateBlock(i, { ...b, text: e.target.value }) }), _jsx("input", { value: b.url, placeholder: "\u0421\u0441\u044B\u043B\u043A\u0430 (https:// \u0438\u043B\u0438 /page)", onChange: (e) => updateBlock(i, { ...b, url: e.target.value }) })] }))] }, b.id))), _jsxs("div", { className: "editor-actions", children: [_jsx("button", { onClick: addTextBlock, children: "\u2795 \u0422\u0435\u043A\u0441\u0442" }), _jsx("button", { onClick: addCardBlock, children: "\u2795 \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430" }), _jsx("button", { onClick: addButtonBlock, children: "\u2795 \u041A\u043D\u043E\u043F\u043A\u0430" })] })] }));
}
