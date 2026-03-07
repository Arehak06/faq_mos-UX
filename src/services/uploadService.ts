import { getTelegramUserId } from '../utils/telegram';

const API_URL = 'https://d5dfre3k7o8lq2478qsp.4b4k4pg5.apigw.yandexcloud.net/images'; // замените на ваш URL

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

  const formData = new FormData();
  formData.append('file', file);
  if (displayName) formData.append('displayName', displayName);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'X-Telegram-User-Id': userId.toString() },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Ошибка загрузки');
  }
  return response.json();
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