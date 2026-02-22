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

  let errorMsg = `HTTP error ${response.status}`;
  let responseData: any = null;

  try {
    // Пытаемся распарсить JSON, даже если статус не 200
    responseData = await response.json();
  } catch {
    // Если не удалось, значит ответ не JSON – используем текст ошибки
    const text = await response.text().catch(() => '');
    errorMsg = text || errorMsg;
    throw new Error(errorMsg);
  }

  if (!response.ok) {
    // Если статус не 200, но JSON распарсился, берём сообщение из поля error
    throw new Error(responseData?.error || errorMsg);
  }

  // Успешный ответ должен содержать url
  if (!responseData?.url) {
    throw new Error('Сервер не вернул URL изображения');
  }

  return responseData.url;
}