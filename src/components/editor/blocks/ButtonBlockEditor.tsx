import React from 'react';
import { ButtonBlock } from '../../../types/blocks';

interface Props {
  block: ButtonBlock;
  onUpdate: (block: ButtonBlock) => void;
}

export function ButtonBlockEditor({ block, onUpdate }: Props) {
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
    <>
      <label className="editor-field">
        <span>Текст кнопки</span>
        <input value={block.text} onChange={handleTextChange} placeholder="Текст кнопки" />
      </label>
      <label className="editor-field">
        <span>Иконка (эмодзи или URL)</span>
        <input value={block.icon || ''} onChange={handleIconChange} placeholder="Например: 🚇 или https://..." />
      </label>
      <label className="editor-field">
        <span>Описание (необязательно)</span>
        <input value={block.description || ''} onChange={handleDescChange} placeholder="Краткое описание" />
      </label>
      <label className="editor-field">
        <span>URL фонового изображения</span>
        <input value={block.backgroundImage || ''} onChange={handleBgImageChange} placeholder="https://..." />
      </label>
      <label className="editor-field">
        <span>Ссылка</span>
        <input
          value={block.url}
          onChange={handleUrlChange}
          placeholder="https:// или /page"
          style={!isUrlValid ? { borderColor: 'red' } : {}}
        />
        {!isUrlValid && <small style={{ color: 'red' }}>Ссылка должна начинаться с http:// или /</small>}
      </label>
    </>
  );
}