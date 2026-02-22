import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DynamicPage from './pages/DynamicPage';
import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute';

function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:page" element={<DynamicPage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;