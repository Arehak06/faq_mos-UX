import { PageData } from '../types/page';
import { BlockRenderer } from '../components/BlockRenderer';
import { usePageMainButton } from '../hooks/usePageMainButton';

export default function PageView({ page }: { page: PageData }) {
  usePageMainButton(page);

  return (
    <div className="page">
      <h1 className="page-title">{page.title}</h1>
      {page.blocks.map((b) => (
        <BlockRenderer key={b.id} block={b} />
      ))}
    </div>
  );
}