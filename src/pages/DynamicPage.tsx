import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import PageView from './PageView';
import { Loading } from '../components/Loading';
import NotFound from './NotFound';

export default function DynamicPage() {
  const { "*": path } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages()
      .then(data => {
        setPages(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <Loading />;
  if (!pages) return <NotFound />;

  const pageKey = path || '';
  const pageData = pages[pageKey];

  if (!pageData) return <NotFound />;

  // Проверка доступа по токену
  if (pageData.accessEnabled) {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token !== pageData.accessToken) {
      return <NotFound />;
    }
  }

  return <PageView page={pageData} />;
}