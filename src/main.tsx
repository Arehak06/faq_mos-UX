import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './app.css';
import { initAdmins } from './utils/isAdmin';

initAdmins();

const basename = '/faq_mos-UX';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);