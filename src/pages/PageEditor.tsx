import { useState, useCallback, useMemo, useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Block, TextBlock, CardBlock, ButtonBlock, ImageBlock, AlertBlock } from '../types/blocks';
import { PageData, PageMainButton } from '../types/page';
import { reorder } from '../utils/reorder';
import { uid } from '../utils/uid';
import { uploadImage } from '../services/uploadService';
import { addLog } from '../services/logService';

type Props = {
  page: PageData;
  onChange: (p: PageData) => void;
  allPages?: Record<string, PageData>; // для выбора родительской страницы
};

// Компонент редактора MainButton
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
function BlockEditor({ block, index, onUpdate, onRemove, pageId }: {
  block: Block;
  index: number;
  onUpdate: (index: number, block: Block) => void;
  onRemove: (index: number) => void;
  pageId: string;
}) {
  const handleRemove = () => {
    if (window.confirm('Удалить блок?')) {
      addLog('block_removed', pageId, { type: block.type });
      onRemove(index);
    }
  };

  if (block.type === 'text') {
    const editorRef = useRef<Editor>(null);
    const handleChange = () => {
      if (editorRef.current) {
        const html = editorRef.current.getInstance().getHTML();
        onUpdate(index, { ...block, text: html });
      }
    };

    return (
      <div className="editor-block">
        <div className="editor-block-header">
          <strong>Текст</strong>
          <button className="danger" onClick={handleRemove}>🗑</button>
        </div>
        <Editor
          ref={editorRef}
          initialValue={block.text || ''}
          previewStyle="tab"
          height="300px"
          initialEditType="wysiwyg"
          useCommandShortcut={true}
          language="ru"
          onChange={handleChange}
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task'],
            ['table', 'image'],
            ['link'],
            ['code', 'codeblock'],
          ]}
        />
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
          <button className="danger" onClick={handleRemove}>🗑</button>
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
    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, icon: e.target.value });
    };
    const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, backgroundImage: e.target.value });
    };
    const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, description: e.target.value });
    };
    const isUrlValid = block.url === '' || block.url.startsWith('http') || block.url.startsWith('/');

    return (
      <div className="editor-block">
        <div className="editor-block-header">
          <strong>Кнопка</strong>
          <button className="danger" onClick={handleRemove}>🗑</button>
        </div>
        <input value={block.text} placeholder="Текст кнопки" onChange={handleTextChange} />
        <input value={block.icon || ''} placeholder="Иконка (эмодзи или URL)" onChange={handleIconChange} />
        <input value={block.description || ''} placeholder="Описание (необязательно)" onChange={handleDescChange} />
        <input value={block.backgroundImage || ''} placeholder="URL фонового изображения" onChange={handleBgImageChange} />
        <input
          value={block.url}
          placeholder="Ссылка (https:// или /page)"
          onChange={handleUrlChange}
          style={!isUrlValid ? { borderColor: 'red' } : {}}
        />
        {!isUrlValid && <small style={{ color: 'red' }}>Ссылка должна начинаться с http:// или /</small>}
      </div>
    );
  }

  if (block.type === 'alert') {
    const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onUpdate(index, { ...block, severity: e.target.value as 'info' | 'warning' | 'important' });
    };
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, text: e.target.value });
    };
    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, icon: e.target.value });
    };
    const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, backgroundColor: e.target.value });
    };
    const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(index, { ...block, textColor: e.target.value });
    };

    return (
      <div className="editor-block">
        <div className="editor-block-header">
          <strong>Уведомление</strong>
          <button className="danger" onClick={handleRemove}>🗑</button>
        </div>
        <select value={block.severity} onChange={handleSeverityChange}>
          <option value="info">Информация (синий)</option>
          <option value="warning">Внимание (жёлтый)</option>
          <option value="important">Важно (красный)</option>
        </select>
        <input value={block.text} placeholder="Текст уведомления" onChange={handleTextChange} />
        <input value={block.icon || ''} placeholder="Иконка (эмодзи или URL)" onChange={handleIconChange} />
        <input value={block.backgroundColor || ''} placeholder="Цвет фона (например, #e3f2fd)" onChange={handleBgColorChange} />
        <input value={block.textColor || ''} placeholder="Цвет текста (например, #0d47a1)" onChange={handleTextColorChange} />
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
          <button className="danger" onClick={handleRemove}>🗑</button>
        </div>
        <input value={block.url} placeholder="URL изображения" onChange={handleUrlChange} />
        <input value={block.alt || ''} placeholder="Alt текст (для доступности)" onChange={handleAltChange} />
        <input value={block.caption || ''} placeholder="Подпись под изображением" onChange={handleCaptionChange} />
      </div>
    );
  }

  return null;
}

export default function PageEditor({ page, onChange, allPages }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blocksList = useMemo(() => page.blocks, [page.blocks]);

  const handleAddTextBlock = useCallback(() => {
    const block: TextBlock = { id: uid(), type: 'text', text: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
    addLog('block_added', page.id, { type: 'text' });
  }, [page, onChange]);

  const handleAddCardBlock = useCallback(() => {
    const block: CardBlock = { id: uid(), type: 'card', title: '', text: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
    addLog('block_added', page.id, { type: 'card' });
  }, [page, onChange]);

  const handleAddButtonBlock = useCallback(() => {
    const block: ButtonBlock = { id: uid(), type: 'button', text: '', url: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
    addLog('block_added', page.id, { type: 'button' });
  }, [page, onChange]);

  const handleAddInfoBlock = useCallback(() => {
    const block: AlertBlock = {
      id: uid(),
      type: 'alert',
      severity: 'info',
      text: 'Информация',
      icon: 'ℹ️',
    };
    onChange({ ...page, blocks: [...page.blocks, block] });
    addLog('block_added', page.id, { type: 'alert', severity: 'info' });
  }, [page, onChange]);

  const handleAddWarningBlock = useCallback(() => {
    const block: AlertBlock = {
      id: uid(),
      type: 'alert',
      severity: 'warning',
      text: 'Внимание',
      icon: '⚠️',
    };
    onChange({ ...page, blocks: [...page.blocks, block] });
    addLog('block_added', page.id, { type: 'alert', severity: 'warning' });
  }, [page, onChange]);

  const handleAddImportantBlock = useCallback(() => {
    const block: AlertBlock = {
      id: uid(),
      type: 'alert',
      severity: 'important',
      text: 'Важно',
      icon: '🔴',
    };
    onChange({ ...page, blocks: [...page.blocks, block] });
    addLog('block_added', page.id, { type: 'alert', severity: 'important' });
  }, [page, onChange]);

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
      addLog('image_uploaded', page.id, { filename: file.name, url });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
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

      <label className="editor-field">
        <span>Описание для главного меню</span>
        <input
          value={page.description || ''}
          onChange={(e) => onChange({ ...page, description: e.target.value })}
          placeholder="Краткое описание страницы"
        />
      </label>

      <label className="editor-field">
        <span>Эмодзи или URL иконки</span>
        <input
          value={page.emoji || ''}
          onChange={(e) => onChange({ ...page, emoji: e.target.value })}
          placeholder="Например: 🚇 или https://example.com/icon.png"
        />
      </label>

      {/* Выбор родительской страницы */}
      {allPages && (
        <label className="editor-field">
          <span>Родительская страница</span>
          <select
            value={page.parentId || ''}
            onChange={(e) => onChange({ ...page, parentId: e.target.value || undefined })}
          >

        <label className="editor-field">
  <span>Порядок сортировки (число)</span>
  <input
    type="number"
    value={page.order ?? 0}
    onChange={(e) => onChange({ ...page, order: parseInt(e.target.value, 10) })}
    min="0"
    step="1"
  />
  <small>Меньшее число — выше в списке</small>
</label>
            <option value="">— Корневая страница —</option>
            {Object.entries(allPages)
              .filter(([key, p]) => key !== page.id)
              .map(([key, p]) => (
                <option key={key} value={key}>
                  {p.title} ({key})
                </option>
              ))}
          </select>
        </label>
      )}

      {/* Закрепление на главной (для всех страниц, кроме home) */}
      {page.id !== 'home' && (
        <label className="editor-field checkbox" style={{ marginTop: '8px' }}>
          <input
            type="checkbox"
            checked={!!page.featured}
            onChange={(e) => onChange({ ...page, featured: e.target.checked })}
          />
          <span>Закрепить на главной странице (будет показываться в отдельном блоке)</span>
        </label>
      )}

      {/* Дополнительные поля для главной страницы */}
      {page.id === 'home' && (
        <>
          <label className="editor-field">
            <span>Заголовок главной страницы (H1)</span>
            <input
              value={page.mainTitle || '🚇 Транспорт Москвы'}
              onChange={(e) => onChange({ ...page, mainTitle: e.target.value })}
              placeholder="Например: 🚇 Транспорт Москвы"
            />
          </label>

          <label className="editor-field">
            <span>Заголовок раздела со страницами</span>
            <input
              value={page.sectionTitle || 'ВСЕ СТРАНИЦЫ'}
              onChange={(e) => onChange({ ...page, sectionTitle: e.target.value })}
              placeholder="Например: ВСЕ СТРАНИЦЫ"
            />
          </label>

          {/* Настройки подвала (только для home) */}
          <h3 style={{ marginTop: '24px' }}>Настройки подвала</h3>

          <label className="editor-field checkbox">
            <input
              type="checkbox"
              checked={page.footerSettings?.enabled ?? true}
              onChange={(e) =>
                onChange({
                  ...page,
                  footerSettings: {
                    enabled: e.target.checked,
                    copyrightText: page.footerSettings?.copyrightText ?? '',
                    links: page.footerSettings?.links ?? [],
                  },
                })
              }
            />
            <span>Показывать подвал</span>
          </label>

          <label className="editor-field">
            <span>Текст копирайта</span>
            <input
              value={page.footerSettings?.copyrightText || `© ${new Date().getFullYear()} Транспорт Москвы. Все права защищены.`}
              onChange={(e) =>
                onChange({
                  ...page,
                  footerSettings: {
                    enabled: page.footerSettings?.enabled ?? true,
                    copyrightText: e.target.value,
                    links: page.footerSettings?.links ?? [],
                  },
                })
              }
              placeholder="Например: © 2024 Транспорт Москвы"
            />
          </label>

          <div className="footer-links-editor">
            <span>Ссылки в подвале</span>
            {(page.footerSettings?.links || []).map((link, idx) => (
              <div key={idx} className="footer-link-row">
                <input
                  type="text"
                  value={link.text}
                  onChange={(e) => {
                    const newLinks = [...(page.footerSettings?.links || [])];
                    newLinks[idx] = { ...link, text: e.target.value };
                    onChange({
                      ...page,
                      footerSettings: {
                        enabled: page.footerSettings?.enabled ?? true,
                        copyrightText: page.footerSettings?.copyrightText ?? '',
                        links: newLinks,
                      },
                    });
                  }}
                  placeholder="Текст ссылки"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...(page.footerSettings?.links || [])];
                    newLinks[idx] = { ...link, url: e.target.value };
                    onChange({
                      ...page,
                      footerSettings: {
                        enabled: page.footerSettings?.enabled ?? true,
                        copyrightText: page.footerSettings?.copyrightText ?? '',
                        links: newLinks,
                      },
                    });
                  }}
                  placeholder="URL (например /privacy)"
                />
                <button
                  className="danger"
                  onClick={() => {
                    const newLinks = (page.footerSettings?.links || []).filter((_, i) => i !== idx);
                    onChange({
                      ...page,
                      footerSettings: {
                        enabled: page.footerSettings?.enabled ?? true,
                        copyrightText: page.footerSettings?.copyrightText ?? '',
                        links: newLinks,
                      },
                    });
                  }}
                >
                  🗑
                </button>
              </div>
            ))}
            <button
              className="tg-button"
              style={{ marginTop: '8px' }}
              onClick={() => {
                const newLinks = [...(page.footerSettings?.links || []), { text: '', url: '' }];
                onChange({
                  ...page,
                  footerSettings: {
                    enabled: page.footerSettings?.enabled ?? true,
                    copyrightText: page.footerSettings?.copyrightText ?? '',
                    links: newLinks,
                  },
                });
              }}
            >
              + Добавить ссылку
            </button>
          </div>
        </>
      )}

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

      <label className="editor-field checkbox" style={{ marginTop: '16px' }}>
        <input
          type="checkbox"
          checked={!!page.hidden}
          onChange={(e) => onChange({ ...page, hidden: e.target.checked })}
        />
        <span>Скрыть страницу (не показывать в публичном доступе)</span>
      </label>

      <h3 style={{ marginTop: '24px' }}>Блоки</h3>
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
            pageId={page.id}
          />
        </div>
      ))}

      <div className="editor-actions">
        <button onClick={handleAddTextBlock}>➕ Текст</button>
        <button onClick={handleAddCardBlock}>➕ Карточка</button>
        <button onClick={handleAddButtonBlock}>➕ Кнопка</button>
        <button onClick={handleAddInfoBlock}>ℹ️ Инфо</button>
        <button onClick={handleAddWarningBlock}>⚠️ Внимание</button>
        <button onClick={handleAddImportantBlock}>🔴 Важно</button>
        <button onClick={handleAddImageClick} disabled={uploading}>
          {uploading ? '⏳ Загрузка...' : '➕ Изображение'}
        </button>
      </div>
    </div>
  );
}