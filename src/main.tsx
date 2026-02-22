import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import App from './App'
import './app.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
// вместо MemoryRouter
<HashRouter>
  <App />
</HashRouter>
)
