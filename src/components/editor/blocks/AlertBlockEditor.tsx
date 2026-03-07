import React from 'react';
import { AlertBlock } from '../../../types/blocks';

interface Props {
  block: AlertBlock;
  onUpdate: (block: AlertBlock) => void;
}

export function AlertBlockEditor({ block, onUpdate }: Props) {
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
    <>
      <label className="editor-field">
        <span>Тип уведомления</span>
        <select value={block.severity} onChange={handleSeverityChange}>
          <option value="info">Информация (синий)</option>
          <option value="warning">Внимание (жёлтый)</option>
          <option value="important">Важно (красный)</option>
        </select>
      </label>
      <label className="editor-field">
        <span>Текст уведомления</span>
        <input value={block.text} onChange={handleTextChange} placeholder="Текст" />
      </label>
      <label className="editor-field">
        <span>Иконка (эмодзи или URL)</span>
        <input value={block.icon || ''} onChange={handleIconChange} placeholder="⚠️ или https://..." />
      </label>
      <label className="editor-field">
        <span>Цвет фона</span>
        <input value={block.backgroundColor || ''} onChange={handleBgColorChange} placeholder="#ffebee" />
      </label>
      <label className="editor-field">
        <span>Цвет текста</span>
        <input value={block.textColor || ''} onChange={handleTextColorChange} placeholder="#b71c1c" />
      </label>
    </>
  );
}