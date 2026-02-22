import matter from 'gray-matter';
import { Block, TextBlock } from '../types/blocks';
import { uid } from './uid';

export function importMarkdown(md: string) {
  const { data, content } = matter(md);

  const lines = content.split('\n');
  const blocks: Block[] = [];

  let buffer: string[] = [];

  const flushText = () => {
    if (buffer.length) {
      const textBlock: TextBlock = {
        id: uid(),
        type: 'text',
        text: buffer.join('\n').trim(),
      };
      blocks.push(textBlock);
      buffer = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushText();
      const headingBlock: TextBlock = {
        id: uid(),
        type: 'text',
        text: line.replace('## ', ''),
      };
      blocks.push(headingBlock);
      continue;
    }

    if (line.trim() === '') {
      flushText();
      continue;
    }

    buffer.push(line);
  }

  flushText();

  return {
    title: data.title || 'Без названия',
    blocks,
  };
}