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

    case 'button': {
      const isUrlValid = block.url.startsWith('http') || block.url.startsWith('/');
      const buttonStyle: React.CSSProperties = {
        backgroundImage: block.backgroundImage ? `url(${block.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

      return (
        <button
          className="tg-button"
          style={buttonStyle}
          onClick={() => {
            if (block.url.startsWith('http')) {
              window.open(block.url, '_blank');
            } else {
              navigate(block.url);
            }
          }}
        >
          {block.icon && <span className="button-icon">{block.icon}</span>}
          <span className="button-text">{block.text}</span>
          {block.description && <span className="button-description">{block.description}</span>}
        </button>
      );
    }

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

    case 'warning':
      return (
        <div
          className="warning-block"
          style={{
            backgroundColor: block.backgroundColor || '#ffebee',
            color: block.textColor || '#b71c1c',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {block.icon && <span className="warning-icon">{block.icon}</span>}
          <span className="warning-text">{block.text}</span>
        </div>
      );

    default:
      return null;
  }
}