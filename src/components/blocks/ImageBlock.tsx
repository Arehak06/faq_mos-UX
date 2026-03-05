import React from 'react';
import { ImageBlock as ImageBlockType } from '../../types/blocks';
import { TgCard } from '../common/TgCard';

export function ImageBlock({ block }: { block: ImageBlockType }) {
  return (
    <TgCard>
      <img
        src={block.url}
        alt={block.alt || ''}
        className="tg-image"
        loading="lazy"
      />
      {block.caption && <p className="card-text" style={{ marginTop: '8px' }}>{block.caption}</p>}
    </TgCard>
  );
}