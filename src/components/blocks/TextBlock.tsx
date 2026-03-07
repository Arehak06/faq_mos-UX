import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TextBlock as TextBlockType } from '../../types/blocks';
import { TgCard } from '../common/TgCard';

export function TextBlock({ block }: { block: TextBlockType }) {
  // Если есть готовый HTML от сервера, используем его
  if (block.html) {
    return (
      <TgCard>
        <div dangerouslySetInnerHTML={{ __html: block.html }} />
      </TgCard>
    );
  }

  // Для старых данных (до перехода на YFM) рендерим GFM
  return (
    <TgCard>
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
    </TgCard>
  );
}