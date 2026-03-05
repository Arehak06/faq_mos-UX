import React from 'react';
import { ButtonBlock } from '../../../types/blocks';

interface Props {
  block: ButtonBlock;
  onUpdate: (block: ButtonBlock) => void;
  onRemove: () => void;
}

export function ButtonBlockEditor({ block, onUpdate, onRemove }: Props) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, text: e.target.value });
  };
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, url: e.target.value });
  };
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, icon: e.target.value });
  };
  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, backgroundImage: e.target.value });
  };
  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, description: e.target.value });
  };
  const isUrlValid = block.url === '' || block.url.startsWith('http') || block.url.startsWith('/');

  return (
    <div className="editor-block">
      <div className="editor-block-header">
        <strong>Кнопка</strong>
        <button className="danger" onClick={onRemove}>🗑</button>
      </div>
      <input value={block.text} placeholder="Текст кнопки" onChange={handleTextChange} />
      <input value={block.icon || ''} placeholder="Иконка (эмодзи или URL)" onChange={handleIconChange} />
      <input value={block.description || ''} placeholder="Описание (необязательно)" onChange={handleDescChange} />
      <input value={block.backgroundImage || ''} placeholder="URL фонового изображения" onChange={handleBgImageChange} />
      <input
        value={block.url}
        placeholder="Ссылка (https:// или /page)"
        onChange={handleUrlChange}
        style={!isUrlValid ? { borderColor: 'red' } : {}}
      />
      {!isUrlValid && <small style={{ color: 'red' }}>Ссылка должна начинаться с http:// или /</small>}
    </div>
  );
}