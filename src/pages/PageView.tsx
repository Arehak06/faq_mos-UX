import { PageData } from '../types/page';
import { BlockRenderer } from '../components/BlockRenderer';
import { usePageMainButton } from '../hooks/usePageMainButton';

export default function PageView({ page }: { page: PageData }) {
  usePageMainButton(page);

  return (
    <div className="page">
      <h1 className="page-title">{page.title}</h1>
      {page.updatedAt && (
        <div style={{ fontSize: '12px', color: 'var(--tg-hint)', marginBottom: '12px' }}>
          Последнее обновление: {new Date(page.updatedAt).toLocaleString()}
          {page.updatedBy && ` пользователем ${page.updatedBy}`}
        </div>
      )}
      {page.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}