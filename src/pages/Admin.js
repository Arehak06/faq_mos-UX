import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import PageEditor from './PageEditor';
import PageView from './PageView';
import { loadPages, savePages } from '../utils/storage';
import { useTelegramMainButton } from '../hooks/useTelegramMainButton';
import { importMarkdown } from '../utils/importMarkdown';
export default function Admin() {
    const [pages, setPages] = useState(loadPages());
    const [current, setCurrent] = useState('home');
    const [mode, setMode] = useState('edit');
    const [saved, setSaved] = useState(true);
    const page = pages[current];
    const updatePage = (p) => {
        setPages({ ...pages, [current]: p });
        setSaved(false);
    };
    const save = () => {
        savePages(pages);
        setSaved(true);
    };
    const importFile = async (file) => {
        const text = await file.text();
        const page = importMarkdown(text);
        setPages({
            ...pages,
            [current]: page
        });
        setSaved(false);
    };
    useTelegramMainButton({
        text: '💾 Сохранить',
        onClick: save,
        visible: mode === 'edit'
    });
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { children: "\uD83D\uDEE0 \u0410\u0434\u043C\u0438\u043D\u043A\u0430" }), _jsxs("div", { className: "admin-toolbar", children: [_jsx("select", { value: current, onChange: (e) => setCurrent(e.target.value), children: Object.keys(pages).map((k) => (_jsx("option", { value: k, children: k }, k))) }), _jsx("button", { onClick: () => setMode(mode === 'edit' ? 'view' : 'edit'), children: mode === 'edit' ? '👁 Просмотр' : '✏️ Редактор' }), _jsx("button", { onClick: save, disabled: saved, children: "\uD83D\uDCBE \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" })] }), _jsx("input", { type: "file", accept: ".md,.mdx", onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file)
                        importFile(file);
                } }), mode === 'view' ? (_jsx(PageView, { page: page })) : (_jsx(PageEditor, { page: page, onChange: updatePage }))] }));
}
