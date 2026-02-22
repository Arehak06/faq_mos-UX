import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './app.css';
ReactDOM.createRoot(document.getElementById('root')).render(
// вместо MemoryRouter
_jsx(HashRouter, { children: _jsx(App, {}) }));
