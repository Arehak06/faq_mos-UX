import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { loadPages, savePages } from '../utils/storage';
import PageEditor from './PageEditor';
import PageView from './PageView';
export default function Admin() {
    const [pages, setPages] = useState(loadPages());
    const [current, setCurrent] = useState('home');
    const [preview, setPreview] = useState(false);
    const page = pages[current];
    const updatePage = (p) => {
        setPages({ ...pages, [current]: p });
    };
    const save = () => {
        savePages(pages);
        alert('Сохранено');
    };
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { children: "\uD83D\uDEE0 \u0410\u0434\u043C\u0438\u043D\u043A\u0430" }), _jsx("select", { value: current, onChange: (e) => setCurrent(e.target.value), children: Object.keys(pages).map((k) => (_jsx("option", { value: k, children: k }, k))) }), _jsx("button", { onClick: () => setPreview(!preview), children: preview ? '✏️ Редактировать' : '👁 Просмотр' }), _jsx("button", { onClick: save, children: "\uD83D\uDCBE \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" }), preview ? (_jsx(PageView, { page: page })) : (_jsx(PageEditor, { page: page, onChange: updatePage }))] }));
}
