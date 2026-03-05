import { useNavigate } from 'react-router-dom';
import { Block } from '../../types/blocks';
import { TgCard } from '../common/TgCard';
import { TextBlock } from './TextBlock';
import { CardBlock } from './CardBlock';
import { ButtonBlock } from './ButtonBlock';
import { ImageBlock } from './ImageBlock';
import { AlertBlock } from './AlertBlock';

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'card':
      return <CardBlock block={block} />;
    case 'button':
      return <ButtonBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'alert':
      return <AlertBlock block={block} />;
    default:
      return null;
  }
}