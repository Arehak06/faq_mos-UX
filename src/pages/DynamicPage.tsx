import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import PageView from './PageView';

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

  if (loading) return <div className="page">Загрузка...</div>;
  if (!pages) return <div className="page">Ошибка загрузки данных</div>;

  const pageKey = path || ''; // для главной страницы не используется
  const pageData = pages[pageKey];

  if (!pageData) {
    return (
      <div className="page">
        <h1 className="page-title">404</h1>
        <p>Страница не найдена</p>
      </div>
    );
  }

  return <PageView page={pageData} />;
}