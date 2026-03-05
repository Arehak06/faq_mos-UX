import React from 'react';
import { FooterSettings, FooterLink } from '../../../types/page';

interface Props {
  settings: FooterSettings;
  onChange: (settings: FooterSettings) => void;
}

export function FooterSettingsEditor({ settings, onChange }: Props) {
  const handleEnabledChange = (enabled: boolean) => {
    onChange({ ...settings, enabled });
  };

  const handleCopyrightChange = (copyrightText: string) => {
    onChange({ ...settings, copyrightText });
  };

  const handleLinkChange = (idx: number, field: keyof FooterLink, value: string) => {
    const newLinks = [...settings.links];
    newLinks[idx] = { ...newLinks[idx], [field]: value };
    onChange({ ...settings, links: newLinks });
  };

  const handleAddLink = () => {
    onChange({ ...settings, links: [...settings.links, { text: '', url: '' }] });
  };

  const handleRemoveLink = (idx: number) => {
    onChange({ ...settings, links: settings.links.filter((_, i) => i !== idx) });
  };

  return (
    <div className="footer-links-editor">
      <label className="editor-field checkbox">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => handleEnabledChange(e.target.checked)}
        />
        <span>Показывать подвал</span>
      </label>

      <label className="editor-field">
        <span>Текст копирайта</span>
        <input
          value={settings.copyrightText}
          onChange={(e) => handleCopyrightChange(e.target.value)}
          placeholder="© {year} ..."
        />
      </label>

      <span>Ссылки в подвале</span>
      {settings.links.map((link, idx) => (
        <div key={idx} className="footer-link-row">
          <input
            value={link.text}
            onChange={(e) => handleLinkChange(idx, 'text', e.target.value)}
            placeholder="Текст ссылки"
          />
          <input
            value={link.url}
            onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
            placeholder="URL"
          />
          <button className="danger" onClick={() => handleRemoveLink(idx)}>🗑</button>
        </div>
      ))}
      <button className="tg-button small" onClick={handleAddLink}>
        + Добавить ссылку
      </button>
    </div>
  );
}