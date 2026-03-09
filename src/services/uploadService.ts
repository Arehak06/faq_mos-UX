import { getTelegramUserId } from '../utils/telegram';

const API_URL = 'https://d5dfre3k7o8lq2478qsp.4b4k4pg5.apigw.yandexcloud.net/images';

export interface ImageRecord {
  id: string;
  filename: string;
  displayName: string;
  url: string;
  uploadedAt: string;
  uploadedBy: number;
  size?: number;
}

export async function uploadImage(file: File, displayName?: string): Promise<{ url: string; record: ImageRecord }> {
  const userId = getTelegramUserId();
  if (!userId) throw new Error('Не удалось определить пользователя Telegram');

  const base64 = await fileToBase64(file);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-User-Id': userId.toString(),
    },
    body: JSON.stringify({
      filename: file.name,
      displayName: displayName || file.name,
      base64,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Ошибка загрузки');
  }
  return response.json();
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}

export async function fetchImages(): Promise<ImageRecord[]> {
  const userId = getTelegramUserId();
  if (!userId) throw new Error('Не авторизован');

  const res = await fetch(API_URL, {
    headers: { 'X-Telegram-User-Id': userId.toString() },
  });
  if (!res.ok) throw new Error('Не удалось загрузить список изображений');
  return res.json();
}