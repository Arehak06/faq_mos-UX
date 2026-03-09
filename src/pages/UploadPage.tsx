import React, { useState, useEffect, useRef } from 'react';
import { uploadImage, fetchImages, ImageRecord } from '../services/uploadService';
import { getTelegramUserId } from '../utils/telegram';
import { Loading } from '../components/common/Loading';
import { PageTitle } from '../components/common/PageTitle';

const API_URL = 'https://d5dfre3k7o8lq2478qsp.4b4k4pg5.apigw.yandexcloud.net/images';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoadingImages(true);
    try {
      const data = await fetchImages();
      setImages(data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить список изображений');
    } finally {
      setLoadingImages(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setUploadedUrl(null);
    setError(null);
    setCopySuccess(false);
    if (!displayName) {
      setDisplayName(selected.name.replace(/\.[^/.]+$/, ''));
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadImage(file, displayName || undefined);
      setUploadedUrl(result.url);
      await loadImages();
    } catch (err) {
      setError((err as Error).message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDelete = async (image: ImageRecord) => {
    const userId = getTelegramUserId();
    if (!userId) {
      alert('Не удалось определить пользователя');
      return;
    }
    if (!image.id) {
      alert('Ошибка: идентификатор изображения отсутствует');
      return;
    }
    if (!window.confirm(`Удалить изображение "${image.displayName}"?`)) return;
    setDeleting(image.id);
    try {
      const response = await fetch(`${API_URL}/${image.id}`, {
        method: 'DELETE',
        headers: { 'X-Telegram-User-Id': userId.toString() },
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Ошибка удаления');
      }
      await loadImages();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setUploadedUrl(null);
    setDisplayName('');
    setError(null);
    setCopySuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredImages = images.filter(img =>
    img.displayName.toLowerCase().includes(filterText.toLowerCase()) ||
    img.filename.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="page">
      <PageTitle title="📤 Загрузка изображений" showShare={false} />

      {/* Блок загрузки */}
      <div className="admin-card upload-card">
        <div className="admin-card-title">Загрузить новое изображение</div>
        <div className="upload-area">
          <label htmlFor="file-upload" className="custom-file-upload">
            <span className="upload-icon">📁</span>
            <span>Выберите файл</span>
          </label>
          <input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          {file && (
            <div className="selected-file">
              <span className="file-name">{file.name}</span>
            </div>
          )}
          {file && (
            <div className="display-name-field">
              <label className="editor-field">
                <span>Понятное имя (для поиска)</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Например: логотип метро"
                />
              </label>
            </div>
          )}
          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="upload-preview" />
            </div>
          )}
          {file && !uploadedUrl && (
            <button
              className="tg-button upload-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? '⏳ Загрузка...' : '📤 Загрузить'}
            </button>
          )}
          {error && (
            <div className="alert-block" style={{ backgroundColor: '#ffebee', color: '#b71c1c', marginTop: '12px' }}>
              ⚠️ {error}
            </div>
          )}
          {uploadedUrl && (
            <div className="upload-success">
              <p>✅ Файл загружен</p>
              <div className="url-copy-container">
                <input type="text" value={uploadedUrl} readOnly className="upload-url-input" />
                <button className="copy-button" onClick={() => handleCopy(uploadedUrl)}>
                  {copySuccess ? '✓' : '📋'}
                </button>
              </div>
              <button className="tg-button reset-button" onClick={resetForm}>
                Загрузить ещё
              </button>
            </div>
          )}
        </div>
      </div>

      {/* История загрузок (карточки) */}
      <div className="admin-card">
        <div className="admin-card-title">📋 История загрузок</div>
        <input
          type="text"
          placeholder="Поиск по имени или файлу..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="filter-input"
        />
        {loadingImages ? (
          <Loading />
        ) : filteredImages.length === 0 ? (
          <p className="empty-message">Нет загруженных изображений</p>
        ) : (
          <div className="image-grid">
            {filteredImages.map(img => (
              <div key={img.id} className="image-card">
                <div className="image-info">
                  <div className="image-name">{img.displayName}</div>
                  <div className="image-meta">
                    <span>{img.filename}</span>
                    <span>{new Date(img.uploadedAt).toLocaleDateString()}</span>
                    <span>{img.size ? Math.round(img.size / 1024) + ' KB' : '-'}</span>
                  </div>
                </div>
                <div className="image-actions">
                  <button
                    className="action-button copy"
                    onClick={() => handleCopy(img.url)}
                    title="Копировать ссылку"
                  >
                    📋
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(img)}
                    disabled={deleting === img.id}
                    title="Удалить"
                  >
                    {deleting === img.id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}