import { useNavigate } from 'react-router-dom';
import { Block } from '../types/blocks';
import { TgCard } from './TgCard';

export function BlockRenderer({ block }: { block: Block }) {
  const navigate = useNavigate();

  switch (block.type) {
    case 'text':
      return (
        <TgCard>
          <p>{block.text}</p>
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
    default:
      return null;
  }
}