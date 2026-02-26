import { useNavigate } from 'react-router-dom';
import { Block } from '../types/blocks';
import { TgCard } from './TgCard';

export function BlockRenderer({ block }: { block: Block }) {
  const navigate = useNavigate();

  switch (block.type) {
    case 'text':
      return (
        <TgCard>
          <div dangerouslySetInnerHTML={{ __html: block.text }} />
        </TgCard>
      );

    case 'card':
      return (
        <TgCard>
          <div className="card-title">{block.title}</div>
          <div className="card-text">{block.text}</div>
        </TgCard>
      );

    case 'button':
      return (
        <button
          className="tg-button"
          onClick={() => {
            if (block.url.startsWith('http')) {
              window.open(block.url, '_blank');
            } else {
              navigate(block.url);
            }
          }}
        >
          {block.text}
        </button>
      );

    case 'image':
      return (
        <TgCard>
          <img
            src={block.url}
            alt={block.alt || ''}
            className="tg-image"
            loading="lazy"
          />
          {block.caption && (
            <p className="card-text" style={{ marginTop: '8px' }}>
              {block.caption}
            </p>
          )}
        </TgCard>
      );

    default:
      return null;
  }
}