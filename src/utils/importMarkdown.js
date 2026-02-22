import matter from 'gray-matter';
import { uid } from './uid';
export function importMarkdown(md) {
    const { data, content } = matter(md);
    const lines = content.split('\n');
    const blocks = [];
    let buffer = [];
    const flushText = () => {
        if (buffer.length) {
            const textBlock = {
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
            const headingBlock = {
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
