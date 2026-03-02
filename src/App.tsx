import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DynamicPage from './pages/DynamicPage';
import Admin from './pages/Admin';
import Logs from './pages/Logs';
import Login from './pages/Login';
import AdminRoute from './components/AdminRoute';
import { TelegramBackButton } from './hooks/TelegramBackButton';

function App() {
  // ... (код инициализации Telegram, если нужно)
  return (
    <>
      <TelegramBackButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:page" element={<DynamicPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <AdminRoute>
              <Logs />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;