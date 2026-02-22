import { useParams } from 'react-router-dom';
import { loadPages } from '../utils/storage';
import PageView from './PageView';

export default function DynamicPage() {
  const { page } = useParams();
  const pages = loadPages();
  const pageKey = page || '';
  const pageData = pages[pageKey];

  console.log('DynamicPage: page param =', page);
  console.log('Pages keys:', Object.keys(pages));
  console.log('pageData =', pageData);

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