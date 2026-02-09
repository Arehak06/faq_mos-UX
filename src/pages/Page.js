import { jsx as _jsx } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import PageRenderer from '../components/PageRenderer';
import pages from '../data/pages.json';
export default function Page() {
    const { slug } = useParams();
    const page = pages[slug || 'home'];
    if (!page) {
        return _jsx("div", { className: "page", children: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" });
    }
    return _jsx(PageRenderer, { page: page });
}
