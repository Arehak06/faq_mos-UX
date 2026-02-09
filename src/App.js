import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Schedule from './pages/Schedule';
import Rights from './pages/Rights';
import Fines from './pages/Fines';
import About from './pages/About';
import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute';
import { useTelegramMainButton } from './hooks/useTelegramMainButton';
function App() {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg)
            return;
        tg.ready();
        tg.expand();
    }, []);
    useTelegramMainButton();
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/tickets", element: _jsx(Tickets, {}) }), _jsx(Route, { path: "/schedule", element: _jsx(Schedule, {}) }), _jsx(Route, { path: "/rights", element: _jsx(Rights, {}) }), _jsx(Route, { path: "/fines", element: _jsx(Fines, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminRoute, { children: _jsx(Admin, {}) }) })] }));
}
export default App;
