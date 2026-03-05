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
      <div className="image-block-editor">
        <label className="editor-field">
          <span>URL изображения</span>
          <input value={block.url} onChange={handleUrlChange} placeholder="https://..." />
        </label>
        <label className="editor-field">
          <span>Alt текст (для доступности)</span>
          <input value={block.alt || ''} onChange={handleAltChange} placeholder="Описание изображения" />
        </label>
        <label className="editor-field">
          <span>Подпись под изображением</span>
          <input value={block.caption || ''} onChange={handleCaptionChange} placeholder="Необязательно" />
        </label>
      </div>
    </div>
  );
}