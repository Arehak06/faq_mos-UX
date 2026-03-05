import React from 'react';
import { TextBlock as TextBlockType } from '../../types/blocks';
import { TgCard } from '../common/TgCard';

export function TextBlock({ block }: { block: TextBlockType }) {
  return (
    <TgCard>
      <div dangerouslySetInnerHTML={{ __html: block.text }} />
    </TgCard>
  );
}