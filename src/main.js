import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import './tg-ui.css';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(MemoryRouter, { children: _jsx(App, {}) }));
