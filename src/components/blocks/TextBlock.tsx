import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TextBlock as TextBlockType } from '../../types/blocks';
import { TgCard } from '../common/TgCard';

// Кастомный компонент для цитат
function CustomBlockquote(props: React.BlockquoteHTMLAttributes<HTMLQuoteElement> & { children?: ReactNode }) {
  const { children, ...rest } = props;
  const childrenArray = React.Children.toArray(children);

  // Проверяем, есть ли строковый элемент, начинающийся с префикса [!NOTE] и т.д.
  let alertType: 'note' | 'warning' | 'tip' | 'important' | null = null;
  let contentChildren: ReactNode[] = [];

  for (let i = 0; i < childrenArray.length; i++) {
    const child = childrenArray[i];
    if (i === 0 && typeof child === 'string') {
      const match = child.match(/^\s*\[!(NOTE|WARNING|TIP|IMPORTANT)\]\s*/i);
      if (match) {
        alertType = match[1].toLowerCase() as 'note' | 'warning' | 'tip' | 'important';
        // Остаток строки после префикса (если есть) добавляем как обычный текст
        const afterPrefix = child.slice(match[0].length);
        if (afterPrefix) {
          contentChildren.push(afterPrefix);
        }
        continue; // пропускаем этот элемент, он заменён на иконку
      }
    }
    contentChildren.push(child);
  }

  if (alertType) {
    const styles = {
      note: { backgroundColor: '#e3f2fd', color: '#0d47a1', icon: 'ℹ️' },
      warning: { backgroundColor: '#fff9c4', color: '#f57f17', icon: '⚠️' },
      tip: { backgroundColor: '#e8f5e9', color: '#1b5e20', icon: '💡' },
      important: { backgroundColor: '#ffebee', color: '#b71c1c', icon: '🔴' },
    };
    const style = styles[alertType];

    return (
      <div
        style={{
          backgroundColor: style.backgroundColor,
          color: style.color,
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          border: 'none',
        }}
      >
        <span style={{ fontSize: '24px', flexShrink: 0 }}>{style.icon}</span>
        <div style={{ flex: 1 }}>{contentChildren}</div>
      </div>
    );
  }

  // Обычная цитата
  return (
    <blockquote
      style={{
        margin: '1em 0',
        padding: '1em 1em 1em 3em',
        backgroundColor: '#f0f0f0',
        borderRadius: '12px',
        position: 'relative',
        color: 'var(--tg-text)',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: '12px',
          top: '10px',
          fontSize: '40px',
          color: 'var(--tg-hint)',
          fontFamily: 'Georgia, serif',
          opacity: 0.6,
        }}
      >
        “
      </span>
      {children}
    </blockquote>
  );
}

export function TextBlock({ block }: { block: TextBlockType }) {
  return (
    <TgCard>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          blockquote: CustomBlockquote,
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