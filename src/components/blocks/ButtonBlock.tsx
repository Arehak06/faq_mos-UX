import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonBlock as ButtonBlockType } from '../../types/blocks';

export function ButtonBlock({ block }: { block: ButtonBlockType }) {
  const navigate = useNavigate();
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