import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TextBlock as TextBlockType } from '../types/blocks';

interface Props {
  block?: TextBlockType; // опционально
}

export function TestMarkdown({ block }: Props) {
  const testMarkdown = `
**жирный текст**
*курсив*
## Заголовок 2 уровня
- элемент списка
1. нумерованный список
[ссылка](https://example.com)
`;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Тест Markdown (ожидаемый результат)</h2>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {testMarkdown}
      </ReactMarkdown>

      {block && (
        <>
          <hr />
          <h2>Сырые данные из вашего блока</h2>
          <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(block, null, 2)}
          </pre>
          <h2>Рендеринг вашего блока</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {block.text}
          </ReactMarkdown>
        </>
      )}
    </div>
  );
}