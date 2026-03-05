import React from 'react';
import { TextBlock as TextBlockType } from '../../types/blocks';
import { TgCard } from '../common/TgCard';

export function TextBlock({ block }: { block: TextBlockType }) {
  // Используем html, если он есть; иначе показываем text как fallback
  const content = block.html || block.text;
  return (
    <TgCard>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </TgCard>
  );
}