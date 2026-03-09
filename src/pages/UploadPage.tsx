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

      <div className="admin-card">
        <div className="admin-card-title">Загрузить новое изображение</div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {file && (
          <div style={{ marginTop: '12px' }}>
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
          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <img src={preview} alt="Preview" className="upload-preview" />
          </div>
        )}
        {file && !uploadedUrl && (
          <button
            className="tg-button"
            onClick={handleUpload}
            disabled={uploading}
            style={{ marginTop: '12px' }}
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
          <div style={{ marginTop: '12px' }}>
            <p>✅ Файл загружен</p>
            <div className="upload-url-container">
              <input type="text" value={uploadedUrl} readOnly className="upload-url-input" />
              <button className="tg-button" onClick={() => handleCopy(uploadedUrl)} style={{ flex: '0 0 auto', marginLeft: '8px' }}>
                {copySuccess ? '✓' : '📋'}
              </button>
            </div>
            <button className="tg-button" onClick={resetForm} style={{ marginTop: '8px', background: '#9e9e9e' }}>
              Загрузить ещё
            </button>
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-title">📋 История загрузок</div>
        <input
          type="text"
          placeholder="Поиск по имени или файлу..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '8px', border: '1px solid var(--tg-border)' }}
        />
        {loadingImages ? (
          <Loading />
        ) : filteredImages.length === 0 ? (
          <p>Нет загруженных изображений</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Файл</th>
                  <th>Дата</th>
                  <th>Размер</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredImages.map(img => (
                  <tr key={img.id} style={{ borderBottom: '1px solid var(--tg-border)' }}>
                    <td style={{ padding: '8px' }}>{img.displayName}</td>
                    <td style={{ padding: '8px' }}>{img.filename}</td>
                    <td style={{ padding: '8px' }}>{new Date(img.uploadedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '8px' }}>{img.size ? Math.round(img.size / 1024) + ' KB' : '-'}</td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          className="tg-button"
                          onClick={() => handleCopy(img.url)}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          title="Копировать ссылку"
                        >
                          📋
                        </button>
                        <button
                          className="tg-button danger"
                          onClick={() => handleDelete(img)}
                          disabled={deleting === img.id}
                          style={{ padding: '4px 8px', fontSize: '12px', background: '#ff4d4f' }}
                          title="Удалить"
                        >
                          {deleting === img.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}