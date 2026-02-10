import ReactDOM from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import './app.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MemoryRouter>
    <App />
  </MemoryRouter>
)
