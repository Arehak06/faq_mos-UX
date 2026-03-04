import React, { useState, useRef } from 'react';
import { uploadImage } from '../services/uploadService';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setUploadedUrl(null);
    setError(null);
    setCopySuccess(false);

    // Создаём предпросмотр
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setUploadedUrl(url);
    } catch (err) {
      setError((err as Error).message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setUploadedUrl(null);
    setError(null);
    setCopySuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="page">
      <h1 className="page-title">📤 Загрузка изображений</h1>
      
      <div className="admin-card">
        <div className="admin-card-title">Выберите файл</div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {preview && (
        <div className="admin-card">
          <div className="admin-card-title">Предпросмотр</div>
          <img src={preview} alt="Preview" className="upload-preview" />
        </div>
      )}

      {file && !uploadedUrl && (
        <div className="admin-card">
          <button
            className="tg-button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? '⏳ Загрузка...' : '📤 Загрузить'}
          </button>
        </div>
      )}

      {error && (
        <div className="alert-block" style={{ backgroundColor: '#ffebee', color: '#b71c1c' }}>
          ⚠️ {error}
        </div>
      )}

      {uploadedUrl && (
        <div className="admin-card">
          <div className="admin-card-title">✅ Файл загружен</div>
          <div className="upload-url-container">
            <input
              type="text"
              value={uploadedUrl}
              readOnly
              className="upload-url-input"
            />
            <button
              className="tg-button"
              onClick={handleCopy}
              style={{ flex: '0 0 auto', marginLeft: '8px' }}
            >
              {copySuccess ? '✓ Скопировано' : '📋 Копировать'}
            </button>
          </div>
          <button
            className="tg-button"
            onClick={resetForm}
            style={{ marginTop: '12px', background: '#9e9e9e' }}
          >
            Загрузить ещё
          </button>
        </div>
      )}
    </div>
  );
}