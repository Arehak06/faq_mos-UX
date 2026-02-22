import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DynamicPage from './pages/DynamicPage';
import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute';
import { TelegramBackButton } from './hooks/TelegramBackButton';
function App() {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        tg?.ready();
        tg?.expand();
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(TelegramBackButton, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/:page", element: _jsx(DynamicPage, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminRoute, { children: _jsx(Admin, {}) }) })] })] }));
}
export default App;
