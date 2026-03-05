import React from 'react';
import { TextBlock } from '../../../types/blocks';

interface Props {
  block: TextBlock;
  onUpdate: (block: TextBlock) => void;
  onRemove: () => void;
}

export function TextBlockEditor({ block, onUpdate, onRemove }: Props) {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...block, text: e.target.value });
  };

  return (
    <div className="editor-block">
      <div className="editor-block-header">
        <strong>Текст (YFM)</strong>
        <button className="danger" onClick={onRemove}>🗑</button>
      </div>
      <textarea
        value={block.text}
        onChange={handleTextChange}
        placeholder="Введите YFM-разметку..."
        rows={8}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      <div className="yfm-hint">
        <small>
          Поддерживаются: **жирный**, *курсив*, ## заголовки, [ссылки](url),<br />
          заметки: {'{% note info %}Текст{% endnote %}'}, вкладки: {'{% tabs %}{% endtabs %}'}
        </small>
      </div>
    </div>
  );
}