import { getTelegramUserId } from '../utils/telegram';

const UPLOAD_URL = 'https://d5dfre3k7o8lq2478qsp.4b4k4pg5.apigw.yandexcloud.net/upload';

export async function uploadImage(file: File): Promise<string> {
  const userId = getTelegramUserId();
  if (!userId) {
    throw new Error('Не удалось определить пользователя Telegram');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: {
      'X-Telegram-User-Id': userId.toString(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Ошибка загрузки изображения');
  }

  const data = await response.json();
  return data.url;
}