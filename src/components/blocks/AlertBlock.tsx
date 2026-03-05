import React from 'react';
import { AlertBlock as AlertBlockType } from '../../types/blocks';

export function AlertBlock({ block }: { block: AlertBlockType }) {
  let defaultIcon = 'ℹ️';
  let defaultBg = '#e3f2fd';
  let defaultColor = '#0d47a1';

  if (block.severity === 'warning') {
    defaultIcon = '⚠️';
    defaultBg = '#fff9c4';
    defaultColor = '#f57f17';
  } else if (block.severity === 'important') {
    defaultIcon = '🔴';
    defaultBg = '#ffebee';
    defaultColor = '#b71c1c';
  }

  return (
    <div
      className="alert-block"
      style={{
        backgroundColor: block.backgroundColor || defaultBg,
        color: block.textColor || defaultColor,
        padding: '12px 16px',
        borderRadius: '12px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span className="alert-icon">{block.icon || defaultIcon}</span>
      <span className="alert-text">{block.text}</span>
    </div>
  );
}