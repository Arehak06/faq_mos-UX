import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageTitle } from '../components/common/PageTitle';

export default function TestMarkdownPage() {
  const [customInput, setCustomInput] = useState('');

  // Явно типизируем examples как Record<string, string>
  const examples: Record<string, string> = {
    basic: `
**жирный текст**
*курсив*
~~зачёркнутый~~
## Заголовок 2 уровня
### Заголовок 3 уровня
`,
    lists: `
- маркированный список
- пункт 2
  - вложенный

1. нумерованный список
2. пункт 2
   1. вложенный нумерованный
`,
    links: `
[обычная ссылка](https://example.com)
Автоматическая ссылка: https://example.com
`,
    images: `
![альтернативный текст](https://via.placeholder.com/150)
`,
    tables: `
| Заголовок 1 | Заголовок 2 |
|-------------|-------------|
| ячейка 1    | ячейка 2    |
| ячейка 3    | ячейка 4    |
`,
    tasks: `
- [ ] невыполненная задача
- [x] выполненная задача
`,
    code: `
\`код в строке\`

\`\`\`javascript
function hello() {
  console.log('Привет, мир!');
}
\`\`\`
`,
    blockquotes: `
> цитата
> продолжение цитаты
`,
  };

  return (
    <div className="page">
      <PageTitle title="Тест Markdown" showShare={false} />

      <div className="test-markdown-container">
        {Object.entries(examples).map(([key, markdown]) => (
          <div key={key} className="test-markdown-section">
            <h2>{key}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        ))}
      </div>

      <div className="test-markdown-section">
        <h2>Попробуйте сами</h2>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Введите Markdown здесь..."
          rows={6}
          style={{ width: '100%', fontFamily: 'monospace' }}
        />
        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--tg-card)', borderRadius: '8px' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {customInput || '_здесь будет результат_'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}