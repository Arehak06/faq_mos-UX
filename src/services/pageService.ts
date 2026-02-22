import { PageData } from '../types/page';
import { getTelegramUserId } from '../utils/telegram';

const API_URL = 'https://d5dfre3k7o8lq2478qsp.4b4k4pg5.apigw.yandexcloud.net/pages';

export async function fetchPages(): Promise<Record<string, PageData>> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    let errorMsg = `Failed to fetch pages: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData?.error || errorMsg;
    } catch {
      // игнорируем
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function savePagesToServer(pages: Record<string, PageData>): Promise<void> {
  const userId = getTelegramUserId();
  if (!userId) {
    throw new Error('Не удалось определить пользователя Telegram');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-User-Id': userId.toString(),
    },
    body: JSON.stringify(pages),
  });

  let errorMsg = `HTTP error ${response.status}`;
  let responseData: any = null;

  try {
    responseData = await response.json();
  } catch {
    const text = await response.text().catch(() => '');
    errorMsg = text || errorMsg;
    throw new Error(errorMsg);
  }

  if (!response.ok) {
    throw new Error(responseData?.error || errorMsg);
  }
}