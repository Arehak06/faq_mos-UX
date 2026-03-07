import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Block, TextBlock, CardBlock, ButtonBlock, ImageBlock, AlertBlock } from '../types/blocks';
import { PageData, PageMainButton } from '../types/page';
import { reorder } from '../utils/reorder';
import { uid } from '../utils/uid';
import { uploadImage } from '../services/uploadService';
import { addLog } from '../services/logService';
import { MainButtonEditor } from '../components/editor/MainButtonEditor';
import { FooterSettingsEditor } from '../components/editor/FooterSettingsEditor';
import { BlockEditor } from '../components/editor/BlockEditor';

type Props = {
  page: PageData;
  onChange: (p: PageData) => void;
  allPages?: Record<string, PageData>;
  onSave?: () => Promise<void>; // опционально, для вызова сохранения
};

export default function PageEditor({ page, onChange, allPages, onSave }: Props) {
  const navigate = useNavigate();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  const blocksList = useMemo(() => page.blocks, [page.blocks]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers for adding blocks
  const handleAddTextBlock = useCallback(() => {
    const block: TextBlock = { id: uid(), type: 'text', text: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
    addLog('block_added', page.id, { type: 'text' });
    setShowAddMenu(false);
  }, [page, onChange]);

  const handleAddCardBlock = useCallback(() => {
    const block: CardBlock = { id: uid(), type: 'card', title: '', text: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
    addLog('block_added', page.id, { type: 'card' });
    setShowAddMenu(false);
  }, [page, onChange]);

  const handleAddButtonBlock = useCallback(() => {
    const block: ButtonBlock = { id: uid(), type: 'button', text: '', url: '' };
    onChange({ ...page, blocks: [...page.blocks, block] });
    addLog('block_added', page.id, { type: 'button' });
    setShowAddMenu(false);
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
    setShowAddMenu(false);
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
    setShowAddMenu(false);
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
    setShowAddMenu(false);
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
      setShowAddMenu(false);
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

      <div className="editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="editor-title">Редактирование страницы</h2>
        <div className="editor-header-buttons" style={{ display: 'flex', gap: '8px' }}>
          <button className="tg-button" onClick={() => navigate(-1)}>← Назад</button>
          <button className="tg-button" onClick={() => onSave?.()}>💾 Сохранить</button>
        </div>
      </div>

      {/* Основные поля страницы */}
      <div className="editor-section">
        <label className="editor-field">
          <span>Заголовок страницы</span>
          <input value={page.title} onChange={(e) => onChange({ ...page, title: e.target.value })} />
        </label>

        <label className="editor-field">
          <span>Описание для меню</span>
          <input
            value={page.description || ''}
            onChange={(e) => onChange({ ...page, description: e.target.value })}
            placeholder="Краткое описание"
          />
        </label>

        <label className="editor-field">
          <span>Эмодзи или URL иконки</span>
          <input
            value={page.emoji || ''}
            onChange={(e) => onChange({ ...page, emoji: e.target.value })}
            placeholder="Например: 🚇 или https://..."
          />
        </label>

        <label className="editor-field">
          <span>Порядок сортировки (число)</span>
          <input
            type="number"
            value={page.order ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
              onChange({ ...page, order: val });
            }}
            placeholder="10"
            min="0"
          />
          <small>Меньше — выше в списке</small>
        </label>

        {allPages && (
          <label className="editor-field">
            <span>Родительская страница</span>
            <select
              value={page.parentId || ''}
              onChange={(e) => onChange({ ...page, parentId: e.target.value || undefined })}
            >
              <option value="">— Корневая —</option>
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

        {page.id !== 'home' && (
          <label className="editor-field checkbox">
            <input
              type="checkbox"
              checked={!!page.featured}
              onChange={(e) => onChange({ ...page, featured: e.target.checked })}
            />
            <span>Закрепить на главной</span>
          </label>
        )}
      </div>

      {/* Настройки главной страницы */}
      {page.id === 'home' && (
        <div className="editor-section">
          <h3>Настройки главной страницы</h3>
          <label className="editor-field">
            <span>Заголовок главной (H1)</span>
            <input
              value={page.mainTitle || ''}
              onChange={(e) => onChange({ ...page, mainTitle: e.target.value })}
            />
          </label>
          <label className="editor-field">
            <span>Заголовок раздела со страницами</span>
            <input
              value={page.sectionTitle || 'ВСЕ СТРАНИЦЫ'}
              onChange={(e) => onChange({ ...page, sectionTitle: e.target.value })}
            />
          </label>

          {/* Режим технических работ */}
          <h4>Режим технических работ</h4>
          <label className="editor-field checkbox">
            <input
              type="checkbox"
              checked={page.maintenanceMode ?? false}
              onChange={(e) => onChange({ ...page, maintenanceMode: e.target.checked })}
            />
            <span>Включить режим техработ (поверх всех страниц будет баннер)</span>
          </label>
          {page.maintenanceMode && (
            <label className="editor-field">
              <span>URL изображения для баннера (опционально)</span>
              <input
                value={page.maintenanceImage || ''}
                onChange={(e) => onChange({ ...page, maintenanceImage: e.target.value })}
                placeholder="https://example.com/maintenance.png"
              />
            </label>
          )}

          {/* Настройки подвала */}
          {page.footerSettings && (
            <FooterSettingsEditor
              settings={page.footerSettings}
              onChange={(newSettings) => onChange({ ...page, footerSettings: newSettings })}
            />
          )}
        </div>
      )}

      <h3>Блоки</h3>
      <div className="blocks-container">
        {blocksList.map((b, i) => (
          <div
            key={b.id}
            className="editor-block"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
          >
            <div className="editor-block-header">
              <span
                className="drag-handle"
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
              >
                ⋮⋮
              </span>
              <strong>{b.type}</strong>
              <button className="danger" onClick={() => handleRemoveBlock(i)}>🗑</button>
            </div>
            <BlockEditor
              block={b}
              onUpdate={(updated) => handleUpdateBlock(i, updated)}
            />
          </div>
        ))}
      </div>

      {/* Кнопка добавления блока */}
      <div className="add-block-container" ref={addMenuRef}>
        <button className="add-block-button" onClick={() => setShowAddMenu(!showAddMenu)}>
          <span className="add-icon">➕</span>
          <span>Добавить блок</span>
          <span className="arrow">{showAddMenu ? '▲' : '▼'}</span>
        </button>
        {showAddMenu && (
          <div className="add-block-menu">
            <button onClick={handleAddTextBlock}>
              <span className="menu-icon">📝</span> Текст
            </button>
            <button onClick={handleAddCardBlock}>
              <span className="menu-icon">📇</span> Карточка
            </button>
            <button onClick={handleAddButtonBlock}>
              <span className="menu-icon">🔘</span> Кнопка
            </button>
            <button onClick={handleAddInfoBlock}>
              <span className="menu-icon">ℹ️</span> Инфо (синий)
            </button>
            <button onClick={handleAddWarningBlock}>
              <span className="menu-icon">⚠️</span> Внимание (жёлтый)
            </button>
            <button onClick={handleAddImportantBlock}>
              <span className="menu-icon">🔴</span> Важно (красный)
            </button>
            <button onClick={handleAddImageClick}>
              <span className="menu-icon">🖼️</span> Изображение
            </button>
          </div>
        )}
      </div>

      {/* Telegram MainButton */}
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

      {/* Скрыть страницу */}
      <label className="editor-field checkbox">
        <input
          type="checkbox"
          checked={!!page.hidden}
          onChange={(e) => onChange({ ...page, hidden: e.target.checked })}
        />
        <span>Скрыть страницу</span>
      </label>
    </div>
  );
}