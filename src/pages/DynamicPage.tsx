import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import PageView from './PageView';

export default function DynamicPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages()
      .then(setPages)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const pageKey = page || '';
  const pageData = pages?.[pageKey];

  useEffect(() => {
    if (!loading && !pageData && pageKey) {
      const timer = setTimeout(() => navigate('/'), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, pageData, pageKey, navigate]);

  if (loading) return <div className="page">Загрузка...</div>;

  if (!pageData) {
    return (
      <div className="page">
        <h1 className="page-title">404</h1>
        <p>Страница не найдена. Перенаправление...</p>
      </div>
    );
  }

  return <PageView page={pageData} />;
}