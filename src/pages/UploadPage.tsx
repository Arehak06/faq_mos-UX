import React, { useState, useEffect, useRef } from 'react';
import { uploadImage, fetchImages, deleteImage, ImageRecord } from '../services/uploadService';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoadingImages(true);
    try {
      const data = await fetchImages();
      setImages(data);
    } catch (err) {
      console.error(err);
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
      await loadImages(); // обновляем список
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить изображение? Это действие нельзя отменить.')) return;
    try {
      await deleteImage(id);
      await loadImages(); // обновляем список
    } catch (err) {
      alert((err as Error).message);
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
      <h1 className="page-title">📤 Загрузка изображений</h1>

      <div className="admin-card">
        <div className="admin-card-title">Загрузить новое изображение</div>
        <div className="upload-area">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="file-input"
          />
          {file && (
            <div className="upload-details">
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
            <div className="error-message">⚠️ {error}</div>
          )}
          {uploadedUrl && (
            <div className="success-container">
              <p>✅ Файл загружен</p>
              <div className="url-row">
                <input type="text" value={uploadedUrl} readOnly className="url-input" />
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

      <div className="admin-card">
        <div className="admin-card-title">📋 История загрузок</div>
        <input
          type="text"
          placeholder="Поиск по имени или файлу..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="search-input"
        />
        {loadingImages ? (
          <p>Загрузка...</p>
        ) : filteredImages.length === 0 ? (
          <p>Нет загруженных изображений</p>
        ) : (
          <div className="images-table">
            <table>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Файл</th>
                  <th>Дата</th>
                  <th>Размер</th>
                  <th>Ссылка</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredImages.map(img => (
                  <tr key={img.id}>
                    <td>{img.displayName}</td>
                    <td>{img.filename}</td>
                    <td>{new Date(img.uploadedAt).toLocaleDateString()}</td>
                    <td>{img.size ? Math.round(img.size / 1024) + ' KB' : '-'}</td>
                    <td>
                      <button className="copy-link-button" onClick={() => handleCopy(img.url)}>
                        Копировать
                      </button>
                    </td>
                    <td>
                      <button className="delete-button" onClick={() => handleDelete(img.id)}>
                        🗑
                      </button>
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