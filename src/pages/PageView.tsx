import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageData } from '../types/page';
import { BlockRenderer } from '../components/BlockRenderer';
import { usePageMainButton } from '../hooks/usePageMainButton';
import { loadPages } from '../utils/storage';
import { PageTitle } from '../components/common/PageTitle';

export default function PageView({ page }: { page: PageData }) {
  const navigate = useNavigate();
  const [children, setChildren] = useState<PageData[]>([]);

  usePageMainButton(page);

  useEffect(() => {
    loadPages().then(allPages => {
      const childPages = Object.values(allPages)
        .filter(p => p.parentId === page.id && !p.hidden)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));
      setChildren(childPages);
    });
  }, [page.id]);

  const renderIcon = (icon: string | undefined) => {
    if (!icon) return <span className="child-emoji">📄</span>;
    if (icon.startsWith('http')) {
      return <img src={icon} alt="" className="child-emoji custom-icon" />;
    }
    return <span className="child-emoji">{icon}</span>;
  };

  return (
    <div className="page">
      <PageTitle title={page.title} />

      {page.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}

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
                {renderIcon(child.emoji)}
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