import React from 'react';
import { PageMainButton } from '../../types/page';

interface Props {
  mainButton: PageMainButton;
  onChange: (mb: PageMainButton) => void;
}

export function MainButtonEditor({ mainButton, onChange }: Props) {
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