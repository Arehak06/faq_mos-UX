import React from 'react';
import { CardBlock } from '../../../types/blocks';

interface Props {
  block: CardBlock;
  onUpdate: (block: CardBlock) => void;
  onRemove: () => void;
}

export function CardBlockEditor({ block, onUpdate, onRemove }: Props) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, title: e.target.value });
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...block, text: e.target.value });
  };
  return (
    <div className="editor-block">
      <div className="editor-block-header">
        <strong>Карточка</strong>
        <button className="danger" onClick={onRemove}>🗑</button>
      </div>
      <input value={block.title} placeholder="Заголовок карточки" onChange={handleTitleChange} />
      <textarea value={block.text} placeholder="Текст карточки" onChange={handleTextChange} />
    </div>
  );
}