import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import PageEditor from './PageEditor';
import PageView from './PageView';
import { loadPages, savePages } from '../utils/storage';
import { useTelegramMainButton } from '../hooks/useTelegramMainButton';
export default function Admin() {
    const [pages, setPages] = useState(loadPages());
    const [current, setCurrent] = useState('home');
    const [mode, setMode] = useState('edit');
    const page = pages[current];
    /* автосохранение */
    useEffect(() => {
        savePages(pages);
    }, [pages]);
    /* Telegram MainButton */
    useTelegramMainButton({
        text: '💾 Сохранить',
        visible: mode === 'edit',
        onClick: () => savePages(pages)
    });
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: "\uD83D\uDEE0 \u0410\u0434\u043C\u0438\u043D\u043A\u0430" }), _jsxs("div", { className: "admin-card", children: [_jsx("div", { className: "admin-card-title", children: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430" }), _jsx("select", { value: current, onChange: (e) => setCurrent(e.target.value), children: Object.keys(pages).map((k) => (_jsx("option", { value: k, children: k }, k))) })] }), _jsxs("div", { className: "admin-card", children: [_jsx("div", { className: "admin-card-title", children: "\u0420\u0435\u0436\u0438\u043C" }), _jsx("button", { className: "tg-button", onClick: () => setMode(mode === 'edit' ? 'view' : 'edit'), children: mode === 'edit' ? '👁 Просмотр' : '✏️ Редактор' })] }), mode === 'edit' ? (_jsx(PageEditor, { page: page, onChange: (p) => setPages({ ...pages, [current]: p }) })) : (_jsx(PageView, { page: page }))] }));
}
