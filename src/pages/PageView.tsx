import { useMemo } from 'react';
import { PageData } from '../types/page';
import { BlockRenderer } from '../components/BlockRenderer';
import { usePageMainButton } from '../hooks/usePageMainButton';

type Props = {
  page: PageData;
};

export default function PageView({ page }: Props) {
  // Хук для управления главной кнопкой Telegram
  usePageMainButton(page);

  // Мемоизация списка блоков для предотвращения лишних ререндеров BlockRenderer
  const blocks = useMemo(() => page.blocks, [page.blocks]);

  // Проверка наличия данных (на случай, если page пришёл с ошибкой)
  if (!page || !page.title || !Array.isArray(blocks)) {
    return (
      <div className="page">
        <h1 className="page-title">Ошибка загрузки</h1>
        <p>Не удалось отобразить страницу. Попробуйте позже.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">{page.title}</h1>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}