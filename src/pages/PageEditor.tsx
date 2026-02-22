import { useState, useCallback, useMemo, useRef } from 'react';
import { Block, TextBlock, CardBlock, ButtonBlock, ImageBlock } from '../types/blocks';
import { PageData, PageMainButton } from '../types/page';
import { reorder } from '../utils/reorder';
import { uid } from '../utils/uid';
import { uploadImage } from '../services/uploadService';

type Props = {
  page: PageData;
  onChange: (p: PageData) => void;
};

// Компонент редактора MainButton (полная реализация)
function MainButtonEditor({ mainButton, onChange }: { mainButton: PageMainButton; onChange: (mb: PageMainButton) => void }) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...mainButton, text: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...mainButton,
      action: {
        ...mainButton.action,
        type: e.target.value as 'route' | 'link',
      },
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...mainButton,
      action: { ...mainButton.action, value: e.target.value },
    });
  };

  return (
    <div className="editor-mainbutton">
      <label className="editor-field">
        <span>Текст кнопки</span>
        <input value={mainButton.text} onChange={handleTextChange} />
      </label>

      <label className="editor-field">
        <span>Тип действия</span>
        <select value={mainButton.action.type} onChange={handleTypeChange}>
          <option value="route">Переход внутри</option>
          <option value="link">Внешняя ссылка</option>
        </select>
      </label>

      <label className="editor-field">
        <span>Значение</span>
        <input
          placeholder={mainButton.action.type === 'route' ? '/tickets' : 'https://...'}
          value={mainButton.action.value}
          onChange={handleValueChange}
        />
      </label>
    </div>
  );
}

// Компонент редактора отдельного блока
function BlockEditor({ block, index, onUpdate, onRemove }: {
  block: Block;
  index: number;
  onUpdate: (index: number, block: Block) => void;
  onRemove: (index: number) => void;
}) {
  const handleRemove = () => {
    if (window.confirm('Удалить блок?')) {
      onRemove(index);
    }
  };

  if (block.type === 'text') {
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate(index, { ...block, text: e.target.value });
    };
    return (
      <div className="editor-block">
        <div className="editor-block-header">
          <strong>Текст</strong>
          <button className="danger" onClick={handleRemove} aria-label="Удалить блок">
            🗑
          </button>
        </div>
        <textarea value={block.text} placeholder="Текст блока" onChange={handleTextChange} />
      </div>
    );
  }

  if (block.type === 'card') {
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, title: e.target.value });
    };
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate(index, { ...block, text: e.target.value });
    };
    return (
      <div className="editor-block">
        <div className="editor-block-header">
          <strong>Карточка</strong>
          <button className="danger" onClick={handleRemove} aria-label="Удалить блок">
            🗑
          </button>
        </div>
        <input value={block.title} placeholder="Заголовок карточки" onChange={handleTitleChange} />
        <textarea value={block.text} placeholder="Текст карточки" onChange={handleTextChange} />
      </div>
    );
  }

  if (block.type === 'button') {
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, text: e.target.value });
    };
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, url: e.target.value });
    };
    const isUrlValid = block.url === '' || block.url.startsWith('http') || block.url.startsWith('/');

    return (
      <div className="editor-block">
        <div className="editor-block-header">
          <strong>Кнопка</strong>
          <button className="danger" onClick={handleRemove} aria-label="Удалить блок">
            🗑
          </button>
        </div>
        <input value={block.text} placeholder="Текст кнопки" onChange={handleTextChange} />
        <input
          value={block.url}
          placeholder="Ссылка (https:// или /page)"
          onChange={handleUrlChange}
          style={!isUrlValid ? { borderColor: 'red' } : {}}
        />
        {!isUrlValid && (
          <small style={{ color: 'red' }}>Ссылка должна начинаться с http:// или /</small>
        )}
      </div>
    );
  }

  if (block.type === 'image') {
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, url: e.target.value });
    };
    const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, alt: e.target.value });
    };
    const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, caption: e.target.value });
    };

    return (
      <div className="editor-block">
        <div className="editor-block-header">
          <strong>Изображение</strong>
          <button className="danger" onClick={handleRemove} aria-label="Удалить блок">
            🗑
          </button>
        </div>
        <input value={block.url} placeholder="URL изображения" onChange={handleUrlChange} />
        <input value={block.alt || ''} placeholder="Alt текст (для доступности)" onChange={handleAltChange} />
        <input value={block.caption || ''} placeholder="Подпись под изображением" onChange={handleCaptionChange} />
      </div>
    );
  }

  return null;
}

export default function PageEditor({ page, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blocksList = useMemo(() => page.blocks, [page.blocks]);

  const handleAddTextBlock = useCallback(() => {
    const block: TextBlock = { id: uid(), type: 'text', text: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
  }, [page, onChange]);

  const handleAddCardBlock = useCallback(() => {
    const block: CardBlock = { id: uid(), type: 'card', title: '', text: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
  }, [page, onChange]);

  const handleAddButtonBlock = useCallback(() => {
    const block: ButtonBlock = { id: uid(), type: 'button', text: '', url: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
  }, [page, onChange]);

  // Обработка загрузки изображения
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      const block: ImageBlock = {
        id: uid(),
        type: 'image',
        url,
        alt: '',
        caption: '',
      };
      onChange({ ...page, blocks: [...page.blocks, block] });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
      // Очистить input, чтобы можно было выбрать тот же файл снова
      e.target.value = '';
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveBlock = useCallback(
    (index: number) => {
      onChange({ ...page, blocks: page.blocks.filter((_, i) => i !== index) });
    },
    [page, onChange]
  );

  const handleUpdateBlock = useCallback(
    (index: number, updatedBlock: Block) => {
      const blocks = [...page.blocks];
      blocks[index] = updatedBlock;
      onChange({ ...page, blocks });
    },
    [page, onChange]
  );

  const handleToggleMainButton = useCallback(
    (enabled: boolean) => {
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
    },
    [page, onChange]
  );

  const handleMainButtonChange = useCallback(
    (newMainButton: PageMainButton) => {
      onChange({ ...page, mainButton: newMainButton });
    },
    [page, onChange]
  );

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.setData('text/plain', '');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === targetIndex) return;
      const newBlocks = reorder(page.blocks, dragIndex, targetIndex);
      onChange({ ...page, blocks: newBlocks });
      setDragIndex(null);
    },
    [dragIndex, page, onChange]
  );

  return (
    <div className="editor">
      {/* Скрытый input для загрузки файлов */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileSelect}
      />

      <label className="editor-field">
        <span>Заголовок страницы</span>
        <input value={page.title} onChange={(e) => onChange({ ...page, title: e.target.value })} />
      </label>

      <h3>Telegram MainButton</h3>
      <label className="editor-field checkbox">
        <input
          type="checkbox"
          checked={!!page.mainButton}
          onChange={(e) => handleToggleMainButton(e.target.checked)}
        />
        <span>Показывать кнопку</span>
      </label>

      {page.mainButton && (
        <MainButtonEditor mainButton={page.mainButton} onChange={handleMainButtonChange} />
      )}

      <h3>Блоки</h3>
      {blocksList.map((b, i) => (
        <div
          key={b.id}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, i)}
        >
          <BlockEditor
            block={b}
            index={i}
            onUpdate={handleUpdateBlock}
            onRemove={handleRemoveBlock}
          />
        </div>
      ))}

      <div className="editor-actions">
        <button onClick={handleAddTextBlock}>➕ Текст</button>
        <button onClick={handleAddCardBlock}>➕ Карточка</button>
        <button onClick={handleAddButtonBlock}>➕ Кнопка</button>
        <button onClick={handleAddImageClick} disabled={uploading}>
          {uploading ? '⏳ Загрузка...' : '➕ Изображение'}
        </button>
      </div>
    </div>
  );
}