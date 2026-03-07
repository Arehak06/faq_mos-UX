import React, { useState } from 'react';
import { TextBlock } from '../../../types/blocks';

interface Props {
  block: TextBlock;
  onUpdate: (block: TextBlock) => void;
  onRemove: () => void;
}

export function TextBlockEditor({ block, onUpdate, onRemove }: Props) {
  const [showHelp, setShowHelp] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...block, text: e.target.value });
  };

  return (
    <div className="editor-block">
      <div className="editor-block-header">
        <strong>Текст (Markdown)</strong>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="help-button" onClick={() => setShowHelp(!showHelp)}>
            ?
          </button>
          <button className="danger" onClick={onRemove}>🗑</button>
        </div>
      </div>
      <textarea
        value={block.text}
        onChange={handleTextChange}
        placeholder="Введите Markdown (поддерживается GFM)..."
        rows={8}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      {showHelp && (
        <div className="markdown-help">
          <h4>Основные конструкции GFM</h4>
          <ul>
            <li><code>**жирный**</code> – жирный текст</li>
            <li><code>*курсив*</code> – курсив</li>
            <li><code>~~зачёркнутый~~</code> – зачёркнутый</li>
            <li><code>## Заголовок</code> – заголовок 2 уровня</li>
            <li><code>[текст](url)</code> – ссылка</li>
            <li><code>![alt](url)</code> – изображение</li>
            <li><code>- пункт списка</code> – маркированный список</li>
            <li><code>1. пункт</code> – нумерованный список</li>
            <li><code>`код`</code> – код в строке</li>
            <li><code>```язык\nкод\n```</code> – блок кода</li>
            <li><code>| столбец1 | столбец2 |</code> – таблица</li>
            <li><code>- [ ] задача</code> – чекбокс</li>
          </ul>
        </div>
      )}
    </div>
  );
}