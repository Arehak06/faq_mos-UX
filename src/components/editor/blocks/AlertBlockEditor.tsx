import React from 'react';
import { AlertBlock } from '../../../types/blocks';

interface Props {
  block: AlertBlock;
  onUpdate: (block: AlertBlock) => void;
  onRemove: () => void;
}

export function AlertBlockEditor({ block, onUpdate, onRemove }: Props) {
  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...block, severity: e.target.value as 'info' | 'warning' | 'important' });
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, text: e.target.value });
  };
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, icon: e.target.value });
  };
  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, backgroundColor: e.target.value });
  };
  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...block, textColor: e.target.value });
  };
  return (
    <div className="editor-block">
      <div className="editor-block-header">
        <strong>Уведомление</strong>
        <button className="danger" onClick={onRemove}>🗑</button>
      </div>
      <select value={block.severity} onChange={handleSeverityChange}>
        <option value="info">Информация (синий)</option>
        <option value="warning">Внимание (жёлтый)</option>
        <option value="important">Важно (красный)</option>
      </select>
      <input value={block.text} placeholder="Текст уведомления" onChange={handleTextChange} />
      <input value={block.icon || ''} placeholder="Иконка (эмодзи или URL)" onChange={handleIconChange} />
      <input value={block.backgroundColor || ''} placeholder="Цвет фона (например, #e3f2fd)" onChange={handleBgColorChange} />
      <input value={block.textColor || ''} placeholder="Цвет текста (например, #0d47a1)" onChange={handleTextColorChange} />
    </div>
  );
}