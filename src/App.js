import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Page from './pages/Page';
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Page, {}) }), _jsx(Route, { path: "/:slug", element: _jsx(Page, {}) })] }));
}
