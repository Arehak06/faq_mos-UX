import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import TelegramMainButtonSync from './components/TelegramMainButtonSync';
function App() {
    return (_jsxs(_Fragment, { children: [_jsx(TelegramMainButtonSync, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/tickets", element: _jsx(Tickets, {}) })] })] }));
}
export default App;
