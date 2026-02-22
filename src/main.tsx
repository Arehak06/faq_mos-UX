import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import './app.css';

// Определяем базовый префикс (если он есть в Vite config)
const base = '/faq_mos-UX'; // должен совпадать с base в vite.config.js

// Получаем текущий путь и удаляем префикс, если он есть
const initialPath = window.location.pathname.replace(base, '') || '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MemoryRouter initialEntries={[initialPath]}>
    <App />
  </MemoryRouter>
);