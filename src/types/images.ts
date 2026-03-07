export interface ImageRecord {
  id: string;               // уникальный идентификатор (можно использовать дату+имя)
  filename: string;          // оригинальное имя файла
  displayName: string;       // понятное имя для поиска (задаётся пользователем)
  url: string;               // публичная ссылка на изображение
  uploadedAt: string;        // дата загрузки (ISO)
  uploadedBy: number;        // Telegram ID загрузившего
  size?: number;             // размер файла в байтах (опционально)
}