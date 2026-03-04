import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageData } from '../types/page';
import { BlockRenderer } from '../components/BlockRenderer';
import { usePageMainButton } from '../hooks/usePageMainButton';
import { loadPages } from '../utils/storage';
import { ShareButton } from '../components/ShareButton';

export default function PageView({ page }: { page: PageData }) {
  const navigate = useNavigate();
  const [children, setChildren] = useState<PageData[]>([]);

  usePageMainButton(page);

  useEffect(() => {
    loadPages().then(allPages => {
      const childPages = Object.values(allPages).filter(p => p.parentId === page.id && !p.hidden);
      setChildren(childPages);
    });
  }, [page.id]);

  return (
    <div className="page">
      <h1 className="page-title">{page.title}</h1>
      {page.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}

      <div className="page">
      <div className="page-header">
        <h1 className="page-title">{page.title}</h1>
        <ShareButton title={page.title} />
      </div>
      {/* ... */}
    </div>

      {children.length > 0 && (
        <div className="page-children">
          <h3>Подразделы</h3>
          <div className="children-list">
            {children.map(child => (
              <div
                key={child.id}
                className="child-item"
                onClick={() => navigate(`/${child.id}`)}
              >
                <span className="child-emoji">{child.emoji || '📄'}</span>
                <span className="child-title">{child.title}</span>
                {child.description && <span className="child-description">{child.description}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}