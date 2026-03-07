import React from 'react';
import { ImageBlock } from '../../../types/blocks';

interface Props {
  block: ImageBlock;
  onUpdate: (block: ImageBlock) => void;
}

export function ImageBlockEditor({ block, onUpdate }: Props) {
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
    <div className="image-block-editor">
      <label className="editor-field">
        <span>URL изображения</span>
        <input value={block.url} placeholder="URL изображения" onChange={handleUrlChange} />
      </label>
      <label className="editor-field">
        <span>Alt текст (для доступности)</span>
        <input value={block.alt || ''} placeholder="Alt текст" onChange={handleAltChange} />
      </label>
      <label className="editor-field">
        <span>Подпись под изображением</span>
        <input value={block.caption || ''} placeholder="Подпись" onChange={handleCaptionChange} />
      </label>
    </div>
  );
}