import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import PageView from './PageView';

export default function DynamicPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const pages = loadPages();
  const pageKey = page || '';
  const pageData = pages[pageKey];

  useEffect(() => {
    if (!pageData && pageKey) {
      // Если страница не найдена, через секунду перенаправляем на главную
      const timer = setTimeout(() => navigate('/', { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
  }, [pageData, pageKey, navigate]);

  if (!pageData) {
    return (
      <div className="page">
        <h1 className="page-title">404</h1>
        <p>Страница не найдена. Перенаправление на главную...</p>
      </div>
    );
  }

  return <PageView page={pageData} />;
}