import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import DynamicPage from './pages/DynamicPage';
import Admin from './pages/Admin';
import PageManagement from './pages/PageManagement';
import UploadPage from './pages/UploadPage';
import Logs from './pages/Logs';
import Login from './pages/Login';
import Callback from './pages/Callback';
import AdminRoute from './components/AdminRoute';
import { TelegramBackButton } from './hooks/TelegramBackButton';
import { TopNav } from './components/TopNav';
import { Footer } from './components/Footer';
import { MaintenanceBanner } from './components/MaintenanceBanner';
import { loadPages } from './utils/storage';
import { PageData } from './types/page';

function App() {
  const [pages, setPages] = useState<Record<string, PageData> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      const path = redirect.replace('/faq_mos-UX', '');
      navigate(path);
    }
  }, [navigate]);

  useEffect(() => {
    loadPages()
      .then(setPages)
      .catch(console.error);
  }, []);

  const homePage = pages?.['home'];
  const maintenanceMode = homePage?.maintenanceMode ?? false;
  const maintenanceImage = homePage?.maintenanceImage;

  return (
    <>
      <TelegramBackButton />
      {maintenanceMode && <MaintenanceBanner imageUrl={maintenanceImage} />}
      <TopNav />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<DynamicPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />

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