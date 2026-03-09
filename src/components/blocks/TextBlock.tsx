import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TextBlock as TextBlockType } from '../../types/blocks';
import { TgCard } from '../common/TgCard';

// Вспомогательная функция для извлечения текста из React-узлов
function extractTextFromChildren(children: ReactNode): string {
  let text = '';
  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      text += child;
    } else if (React.isValidElement(child)) {
      const element = child as React.ReactElement<{ children?: ReactNode }>;
      if (element.props && element.props.children) {
        text += extractTextFromChildren(element.props.children);
      }
    }
  });
  return text;
}

// Кастомный компонент для цитат
function CustomBlockquote(props: React.BlockquoteHTMLAttributes<HTMLQuoteElement> & { children?: ReactNode }) {
  const { children, ...rest } = props;
  const fullText = extractTextFromChildren(children);
  const match = fullText.match(/^\s*\[!(NOTE|WARNING|TIP|IMPORTANT)\]\s*(.*)/i);

  if (match) {
    const alertType = match[1].toLowerCase() as 'note' | 'warning' | 'tip' | 'important';
    const content = match[2]; // текст после префикса

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
        <div style={{ flex: 1 }}>{content}</div>
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