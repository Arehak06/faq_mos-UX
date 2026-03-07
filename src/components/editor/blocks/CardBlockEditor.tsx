import React from 'react';
import { CardBlock } from '../../../types/blocks';

interface Props {
  block: CardBlock;
  onUpdate: (block: CardBlock) => void;
}

export function CardBlockEditor({ block, onUpdate }: Props) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, title: e.target.value });
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...block, text: e.target.value });
  };
  return (
    <>
      <label className="editor-field">
        <span>Заголовок карточки</span>
        <input value={block.title} onChange={handleTitleChange} placeholder="Заголовок" />
      </label>
      <label className="editor-field">
        <span>Текст карточки</span>
        <textarea value={block.text} onChange={handleTextChange} placeholder="Текст" rows={3} />
      </label>
    </>
  );
}