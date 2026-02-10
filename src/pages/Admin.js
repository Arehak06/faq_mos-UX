import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
    useEffect(() => {
        savePages(pages);
    }, [pages]);
    useTelegramMainButton({
        text: '💾 Сохранить',
        visible: mode === 'edit',
        onClick: () => savePages(pages)
    });
    return (_jsxs(_Fragment, { children: [_jsx("select", { value: current, onChange: (e) => setCurrent(e.target.value), children: Object.keys(pages).map((k) => (_jsx("option", { children: k }, k))) }), _jsx("button", { onClick: () => setMode(mode === 'edit' ? 'view' : 'edit'), children: mode === 'edit' ? '👁 Просмотр' : '✏️ Редактор' }), mode === 'edit' ? (_jsx(PageEditor, { page: page, onChange: (p) => setPages({ ...pages, [current]: p }) })) : (_jsx(PageView, { page: page }))] }));
}
