import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import PageView from './PageView';
export default function DynamicPage() {
    const { page } = useParams();
    const pages = loadPages();
    const pageKey = page || '';
    const pageData = pages[pageKey];
    if (!pageData) {
        return (_jsxs("div", { className: "page", children: [_jsx("h1", { className: "page-title", children: "404" }), _jsx("p", { children: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" })] }));
    }
    return _jsx(PageView, { page: pageData });
}
