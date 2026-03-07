import { useNavigate } from 'react-router-dom';
import { Block } from '../types/blocks';
import { TgCard } from './common/TgCard';
import { TextBlock } from './blocks/TextBlock'; // импортируем компонент для Markdown

export function BlockRenderer({ block }: { block: Block }) {
  const navigate = useNavigate();

  switch (block.type) {
    case 'text':
      // Используем специальный компонент для Markdown
      return <TextBlock block={block} />;

    case 'card':
      return (
        <TgCard>
          <div className="card-title">{block.title}</div>
          <div className="card-text">{block.text}</div>
        </TgCard>
      );

    case 'button': {
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

    case 'alert': {
      let defaultIcon = 'ℹ️';
      let defaultBg = '#e3f2fd';
      let defaultColor = '#0d47a1';

      if (block.severity === 'warning') {
        defaultIcon = '⚠️';
        defaultBg = '#fff9c4';
        defaultColor = '#f57f17';
      } else if (block.severity === 'important') {
        defaultIcon = '🔴';
        defaultBg = '#ffebee';
        defaultColor = '#b71c1c';
      }

      return (
        <div
          className="alert-block"
          style={{
            backgroundColor: block.backgroundColor || defaultBg,
            color: block.textColor || defaultColor,
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span className="alert-icon">{block.icon || defaultIcon}</span>
          <span className="alert-text">{block.text}</span>
        </div>
      );
    }

    default:
      return null;
  }
}