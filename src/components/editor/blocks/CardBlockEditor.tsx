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
      <input value={block.title} placeholder="Заголовок карточки" onChange={handleTitleChange} />
      <textarea value={block.text} placeholder="Текст карточки" onChange={handleTextChange} />
    </>
  );
}