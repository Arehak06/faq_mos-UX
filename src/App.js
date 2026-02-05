import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import './app.css';
function App() {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg)
            return;
        tg.ready();
        tg.expand();
    }, []);
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/tickets", element: _jsx(Tickets, {}) })] }));
}
export default App;
