import React from 'react';
import { ImageBlock } from '../../../types/blocks';

interface Props {
  block: ImageBlock;
  onUpdate: (block: ImageBlock) => void;
  onRemove: () => void;
}

export function ImageBlockEditor({ block, onUpdate, onRemove }: Props) {
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, url: e.target.value });
  };
  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, alt: e.target.value });
  };
  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, caption: e.target.value });
  };
  return (
    <div className="editor-block">
      <div className="editor-block-header">
        <strong>Изображение</strong>
        <button className="danger" onClick={onRemove}>🗑</button>
      </div>
      <input value={block.url} placeholder="URL изображения" onChange={handleUrlChange} />
      <input value={block.alt || ''} placeholder="Alt текст (для доступности)" onChange={handleAltChange} />
      <input value={block.caption || ''} placeholder="Подпись под изображением" onChange={handleCaptionChange} />
    </div>
  );
}