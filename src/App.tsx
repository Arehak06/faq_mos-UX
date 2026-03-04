import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DynamicPage from './pages/DynamicPage';
import Admin from './pages/Admin';
import PageManagement from './pages/PageManagement';
import UploadPage from './pages/UploadPage';
import Logs from './pages/Logs';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminRoute from './components/AdminRoute';
import { TelegramBackButton } from './hooks/TelegramBackButton';
import { HamburgerMenu } from './components/HamburgerMenu';
import { Footer } from './components/Footer';
import { loadPages } from './utils/storage';
import { PageData } from './types/page';

function App() {
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);

  useEffect(() => {
    loadPages()
      .then(setPages)
      .catch(console.error);
  }, []);

  return (
    <>
      <TelegramBackButton />
      <HamburgerMenu />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<DynamicPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pages"
            element={
              <AdminRoute>
                <PageManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <AdminRoute>
                <UploadPage />
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
      </div>
      <Footer pages={pages} />
    </>
  );
}

export default App;