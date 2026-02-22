import { useState } from 'react';
import { Block, TextBlock, CardBlock, ButtonBlock } from '../types/blocks';
import { PageData } from '../types/page';
import { reorder } from '../utils/reorder';
import { uid } from '../utils/uid';

type Props = {
  page: PageData;
  onChange: (p: PageData) => void;
};

export default function PageEditor({ page, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addTextBlock = () => {
    const block: TextBlock = { id: uid(), type: 'text', text: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
  };

  const addCardBlock = () => {
    const block: CardBlock = { id: uid(), type: 'card', title: '', text: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
  };

  const addButtonBlock = () => {
    const block: ButtonBlock = { id: uid(), type: 'button', text: '', url: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
  };

  const removeBlock = (index: number) => {
    onChange({ ...page, blocks: page.blocks.filter((_, i) => i !== index) });
  };

  const updateBlock = (index: number, block: Block) => {
    const blocks = [...page.blocks];
    blocks[index] = block;
    onChange({ ...page, blocks });
  };

  const toggleMainButton = (enabled: boolean) => {
    if (enabled) {
      onChange({
        ...page,
        mainButton: {
          text: 'Далее',
          action: { type: 'route', value: '/' },
        },
      });
    } else {
      const { mainButton, ...rest } = page;
      onChange(rest);
    }
  };

  return (
    <div className="editor">
      <label className="editor-field">
        <span>Заголовок страницы</span>
        <input value={page.title} onChange={(e) => onChange({ ...page, title: e.target.value })} />
      </label>

      <h3>Telegram MainButton</h3>
      <label className="editor-field checkbox">
        <input type="checkbox" checked={!!page.mainButton} onChange={(e) => toggleMainButton(e.target.checked)} />
        <span>Показывать кнопку</span>
      </label>

      {page.mainButton && (
        <div className="editor-mainbutton">
          <label className="editor-field">
            <span>Текст кнопки</span>
            <input
              value={page.mainButton.text}
              onChange={(e) =>
                onChange({
                  ...page,
                  mainButton: { ...page.mainButton!, text: e.target.value },
                })
              }
            />
          </label>
          <label className="editor-field">
            <span>Тип действия</span>
            <select
              value={page.mainButton.action.type}
              onChange={(e) =>
                onChange({
                  ...page,
                  mainButton: {
                    ...page.mainButton!,
                    action: { ...page.mainButton!.action, type: e.target.value as 'route' | 'link' },
                  },
                })
              }
            >
              <option value="route">Переход внутри</option>
              <option value="link">Внешняя ссылка</option>
            </select>
          </label>
          <label className="editor-field">
            <span>Значение</span>
            <input
              placeholder={page.mainButton.action.type === 'route' ? '/tickets' : 'https://...'}
              value={page.mainButton.action.value}
              onChange={(e) =>
                onChange({
                  ...page,
                  mainButton: {
                    ...page.mainButton!,
                    action: { ...page.mainButton!.action, value: e.target.value },
                  },
                })
              }
            />
          </label>
        </div>
      )}

      <h3>Блоки</h3>
      {page.blocks.map((b, i) => (
        <div
          key={b.id}
          className="editor-block"
          draggable
          onDragStart={(e) => {
            setDragIndex(i);
            e.dataTransfer.setData('text/plain', '');
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex === null || dragIndex === i) return;
            const blocks = reorder(page.blocks, dragIndex, i);
            onChange({ ...page, blocks });
            setDragIndex(null);
          }}
        >
          <div className="editor-block-header">
            <strong>{b.type}</strong>
            <button className="danger" onClick={() => removeBlock(i)}>
              🗑
            </button>
          </div>

          {b.type === 'text' && (
            <textarea value={b.text} placeholder="Текст блока" onChange={(e) => updateBlock(i, { ...b, text: e.target.value })} />
          )}
          {b.type === 'card' && (
            <>
              <input value={b.title} placeholder="Заголовок карточки" onChange={(e) => updateBlock(i, { ...b, title: e.target.value })} />
              <textarea value={b.text} placeholder="Текст карточки" onChange={(e) => updateBlock(i, { ...b, text: e.target.value })} />
            </>
          )}
          {b.type === 'button' && (
            <>
              <input value={b.text} placeholder="Текст кнопки" onChange={(e) => updateBlock(i, { ...b, text: e.target.value })} />
              <input value={b.url} placeholder="Ссылка (https:// или /page)" onChange={(e) => updateBlock(i, { ...b, url: e.target.value })} />
            </>
          )}
        </div>
      ))}

      <div className="editor-actions">
        <button onClick={addTextBlock}>➕ Текст</button>
        <button onClick={addCardBlock}>➕ Карточка</button>
        <button onClick={addButtonBlock}>➕ Кнопка</button>
      </div>
    </div>
  );
}