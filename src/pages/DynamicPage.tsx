import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import PageView from './PageView';

export default function DynamicPage() {
  const { page } = useParams();
  const navigate = useNavigate();

  console.log('[DynamicPage] Рендер с page =', page);

  const pages = loadPages();
  console.log('[DynamicPage] Все страницы:', pages);

  const pageKey = page || '';
  const pageData = pages[pageKey];
  console.log('[DynamicPage] pageData для', pageKey, '=', pageData);

  useEffect(() => {
    console.log('[DynamicPage] useEffect: pageData =', pageData);
    if (!pageData && pageKey) {
      console.log('[DynamicPage] Нет данных, запускаем редирект через 2 секунды');
      const timer = setTimeout(() => {
        console.log('[DynamicPage] Редирект на главную');
        navigate('/', { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pageData, pageKey, navigate]);

  if (!pageData) {
    console.log('[DynamicPage] Рендерим 404');
    return (
      <div className="page">
        <h1 className="page-title">404</h1>
        <p>Страница не найдена. Перенаправление...</p>
      </div>
    );
  }

  console.log('[DynamicPage] Рендерим PageView');
  return <PageView page={pageData} />;
}