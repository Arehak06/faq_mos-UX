import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export default function PageEditor({ page, onChange }) {
    return (_jsxs("div", { className: "editor", children: [_jsx("h3", { children: "\u270F\uFE0F \u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B" }), _jsxs("label", { children: ["\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A:", _jsx("input", { value: page.title, onChange: (e) => onChange({ ...page, title: e.target.value }) })] }), page.blocks.map((b, i) => (_jsxs("div", { className: "editor-block", children: [_jsx("strong", { children: b.type }), b.type === 'text' && (_jsx("textarea", { value: b.value, onChange: (e) => {
                            const copy = structuredClone(page);
                            copy.blocks[i].value = e.target.value;
                            onChange(copy);
                        } })), b.type === 'card' && (_jsxs(_Fragment, { children: [_jsx("input", { placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A", value: b.title, onChange: (e) => {
                                    const copy = structuredClone(page);
                                    copy.blocks[i].title = e.target.value;
                                    onChange(copy);
                                } }), _jsx("textarea", { placeholder: "\u0422\u0435\u043A\u0441\u0442", value: b.text, onChange: (e) => {
                                    const copy = structuredClone(page);
                                    copy.blocks[i].text = e.target.value;
                                    onChange(copy);
                                } })] }))] }, b.id)))] }));
}
