import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function uid() {
    return Math.random().toString(36).slice(2);
}
export default function PageEditor({ page, onChange }) {
    const addTextBlock = () => {
        onChange({
            ...page,
            blocks: [
                ...page.blocks,
                {
                    id: uid(),
                    type: 'text',
                    value: ''
                }
            ]
        });
    };
    const addCardBlock = () => {
        onChange({
            ...page,
            blocks: [
                ...page.blocks,
                {
                    id: uid(),
                    type: 'card',
                    title: '',
                    text: ''
                }
            ]
        });
    };
    const removeBlock = (index) => {
        const copy = structuredClone(page);
        copy.blocks.splice(index, 1);
        onChange(copy);
    };
    return (_jsxs("div", { className: "editor", children: [_jsxs("label", { className: "editor-field", children: [_jsx("span", { children: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B" }), _jsx("input", { value: page.title, onChange: (e) => onChange({ ...page, title: e.target.value }) })] }), _jsx("h3", { children: "\u0411\u043B\u043E\u043A\u0438" }), page.blocks.map((b, i) => (_jsxs("div", { className: "editor-block", children: [_jsxs("div", { className: "editor-block-header", children: [_jsx("strong", { children: b.type }), _jsx("button", { className: "danger", onClick: () => removeBlock(i), children: "\uD83D\uDDD1" })] }), b.type === 'text' && (_jsx("textarea", { value: b.value, placeholder: "\u0422\u0435\u043A\u0441\u0442 \u0431\u043B\u043E\u043A\u0430", onChange: (e) => {
                            const copy = structuredClone(page);
                            copy.blocks[i].value = e.target.value;
                            onChange(copy);
                        } })), b.type === 'card' && (_jsxs(_Fragment, { children: [_jsx("input", { value: b.title, placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438", onChange: (e) => {
                                    const copy = structuredClone(page);
                                    copy.blocks[i].title = e.target.value;
                                    onChange(copy);
                                } }), _jsx("textarea", { value: b.text, placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438", onChange: (e) => {
                                    const copy = structuredClone(page);
                                    copy.blocks[i].text = e.target.value;
                                    onChange(copy);
                                } })] }))] }, b.id))), _jsxs("div", { className: "editor-actions", children: [_jsx("button", { onClick: addTextBlock, children: "\u2795 \u0422\u0435\u043A\u0441\u0442" }), _jsx("button", { onClick: addCardBlock, children: "\u2795 \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430" })] })] }));
}
