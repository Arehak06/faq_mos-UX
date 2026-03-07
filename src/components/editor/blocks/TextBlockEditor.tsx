import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TextBlock } from '../../../types/blocks';

interface Props {
  block: TextBlock;
  onUpdate: (block: TextBlock) => void;
  onRemove: () => void;
}

export function TextBlockEditor({ block, onUpdate, onRemove }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...block, text: e.target.value });
  };

  // Вставка синтаксиса вокруг выделенного текста или в позицию курсора
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = block.text.substring(start, end);
    const newText =
      block.text.substring(0, start) +
      prefix + selectedText + suffix +
      block.text.substring(end);

    onUpdate({ ...block, text: newText });

    // Восстанавливаем выделение или ставим курсор после вставленного текста
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  const commands = [
    { name: 'Жирный', prefix: '**', suffix: '**' },
    { name: 'Курсив', prefix: '*', suffix: '*' },
    { name: 'Заголовок 2', prefix: '## ', suffix: '' },
    { name: 'Ссылка', prefix: '[', suffix: '](url)' },
    { name: 'Список', prefix: '- ', suffix: '' },
    { name: 'Нумерованный список', prefix: '1. ', suffix: '' },
    { name: 'Цитата', prefix: '> ', suffix: '' },
    { name: 'Код', prefix: '`', suffix: '`' },
    { name: 'Блок кода', prefix: '```\n', suffix: '\n```' },
    { name: 'Таблица', prefix: '| Заголовок1 | Заголовок2 |\n| --- | --- |\n| ячейка1 | ячейка2 |\n', suffix: '' },
  ];

  return (
    <div className="editor-block">
      <div className="editor-block-header">
        <strong>Текст (Markdown)</strong>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="action-button" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? '✏️' : '👁️'}
          </button>
          <button className="danger" onClick={onRemove}>🗑</button>
        </div>
      </div>

      <div className="markdown-toolbar">
        {commands.map((cmd) => (
          <button
            key={cmd.name}
            className="toolbar-button"
            onClick={() => insertMarkdown(cmd.prefix, cmd.suffix)}
            title={cmd.name}
          >
            {cmd.name}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={block.text}
        onChange={handleTextChange}
        placeholder="Введите Markdown..."
        rows={10}
        className="markdown-textarea"
      />

      {showPreview && (
        <div className="markdown-preview">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {block.text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}