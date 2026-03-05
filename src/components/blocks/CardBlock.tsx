import React from 'react';
import { CardBlock as CardBlockType } from '../../types/blocks';
import { TgCard } from '../common/TgCard';

export function CardBlock({ block }: { block: CardBlockType }) {
  return (
    <TgCard>
      <div className="card-title">{block.title}</div>
      <div className="card-text">{block.text}</div>
    </TgCard>
  );
}   