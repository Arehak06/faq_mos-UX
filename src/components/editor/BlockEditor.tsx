import React from 'react';
import { Block } from '../../types/blocks';
import { TextBlockEditor } from './blocks/TextBlockEditor';
import { CardBlockEditor } from './blocks/CardBlockEditor';
import { ButtonBlockEditor } from './blocks/ButtonBlockEditor';
import { ImageBlockEditor } from './blocks/ImageBlockEditor';
import { AlertBlockEditor } from './blocks/AlertBlockEditor';

interface Props {
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
}

export function BlockEditor({ block, onUpdate }: Props) {
  switch (block.type) {
    case 'text':
      return <TextBlockEditor block={block} onUpdate={onUpdate} />;
    case 'card':
      return <CardBlockEditor block={block} onUpdate={onUpdate} />;
    case 'button':
      return <ButtonBlockEditor block={block} onUpdate={onUpdate} />;
    case 'image':
      return <ImageBlockEditor block={block} onUpdate={onUpdate} />;
    case 'alert':
      return <AlertBlockEditor block={block} onUpdate={onUpdate} />;
    default:
      return null;
  }
}