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

function App() {
  return (
    <>
      <TelegramBackButton />
      <HamburgerMenu />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:page" element={<DynamicPage />} />
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
      <Footer />
    </>
  );
}

export default App;