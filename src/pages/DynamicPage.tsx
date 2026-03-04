import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import PageView from './PageView';
import { PageTitle } from '../components/PageTitle';
import { Loading } from '../components/Loading';
import NotFound from './NotFound';

export default function DynamicPage() {
  const { "*": path } = useParams(); // весь путь после базового префикса
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
  if (!pages) return <div className="page">Ошибка загрузки данных</div>;

  const pageKey = path || ''; // для главной страницы не используется
  const pageData = pages[pageKey];

if (!pageData) {
  return <NotFound />;
}

  return <PageView page={pageData} />;
}