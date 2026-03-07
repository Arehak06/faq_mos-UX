import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css'; // обязательно!
import { TextBlock } from '../../../types/blocks';

interface Props {
  block: TextBlock;
  onUpdate: (block: TextBlock) => void;
  onRemove: () => void;
}

export function TextBlockEditor({ block, onUpdate, onRemove }: Props) {
  const [value, setValue] = useState(block.text);

  const handleChange = (newValue?: string) => {
    if (newValue !== undefined) {
      setValue(newValue);
      onUpdate({ ...block, text: newValue });
    }
  };

  return (
    <div className="editor-block">
      <div className="editor-block-header">
        <strong>Текст (Markdown)</strong>
        <button className="danger" onClick={onRemove}>🗑</button>
      </div>
      <div data-color-mode="light">
        <MDEditor
          value={value}
          onChange={handleChange}
          preview="live"
          height={400}
          visibleDragbar={false}
          enableScroll={true}
          textareaProps={{
            placeholder: 'Введите Markdown...',
          }}
        />
      </div>
    </div>
  );
}