import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TextBlock as TextBlockType } from '../../types/blocks';
import { TgCard } from '../common/TgCard';

// Кастомный компонент для цитат с поддержкой alert-синтаксиса
function CustomBlockquote({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement> & { children?: ReactNode }) {
  // Пытаемся извлечь тип заметки из содержимого
  const childrenArray = React.Children.toArray(children);
  let alertType: 'note' | 'warning' | 'tip' | 'important' | null = null;
  let contentWithoutPrefix = children;

  // Ищем в первом дочернем элементе (может быть строкой или другим компонентом)
  const firstChild = childrenArray[0];
  if (typeof firstChild === 'string') {
    const match = firstChild.match(/^\[!(NOTE|WARNING|TIP|IMPORTANT)\]\s*(.*)/i);
    if (match) {
      alertType = match[1].toLowerCase() as 'note' | 'warning' | 'tip' | 'important';
      const rest = match[2] + childrenArray.slice(1).map(c => typeof c === 'string' ? c : '').join('');
      contentWithoutPrefix = rest;
    }
  }

  if (alertType) {
    // Цвета и иконки для разных типов
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
        <div style={{ flex: 1 }}>{contentWithoutPrefix}</div>
      </div>
    );
  }

  // Обычная цитата – используем стандартный <blockquote> с нашими стилями
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