import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import PageView from './PageView';
export default function DynamicPage() {
    const { page } = useParams();
    const navigate = useNavigate();
    const pages = loadPages();
    const pageKey = page || '';
    const pageData = pages[pageKey];
    useEffect(() => {
        if (!pageData && pageKey) {
            // Если страница не найдена, через секунду перенаправляем на главную
            const timer = setTimeout(() => navigate('/', { replace: true }), 2000);
            return () => clearTimeout(timer);
        }
    }, [pageData, pageKey, navigate]);
    if (!pageData) {
        return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: "404" }), _jsx("p", { children: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430. \u041F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E..." })] }));
    }
    return _jsx(PageView, { page: pageData });
}
