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
        <strong>Текст (YFM)</strong>
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
        placeholder="Введите YFM-разметку..."
        rows={8}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      {showHelp && (
        <div className="yfm-help">
          <h4>Основные конструкции YFM</h4>
          <ul>
            <li><code>**жирный**</code> – жирный текст</li>
            <li><code>*курсив*</code> – курсив</li>
            <li><code>## Заголовок</code> – заголовок 2 уровня</li>
            <li><code>[текст](url)</code> – ссылка</li>
            <li>
              <code>
                &#123;% note info %&#125;Текст&#123;% endnote %&#125;
              </code>
              – заметка info
            </li>
            <li>
              <code>
                &#123;% note warning %&#125;Текст&#123;% endnote %&#125;
              </code>
              – предупреждение
            </li>
            <li>
              <code>
                &#123;% note important %&#125;Текст&#123;% endnote %&#125;
              </code>
              – важно
            </li>
            <li>
              <code>
                &#123;% tabs %&#125;&#123;% tab "Вкладка1" %&#125;...&#123;% endtab %&#125;&#123;% tab "Вкладка2" %&#125;...&#123;% endtab %&#125;&#123;% endtabs %&#125;
              </code>
              – вкладки
            </li>
            <li>
              <code>
                &#123;% cut "Заголовок" %&#125;...&#123;% endcut %&#125;
              </code>
              – сворачиваемый блок
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}