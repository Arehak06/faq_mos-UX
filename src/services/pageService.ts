import { PageData } from '../types/page';
import { getTelegramUserId } from '../utils/telegram';

const API_URL = 'https://d5dfre3k7o8lq2478qsp.4b4k4pg5.apigw.yandexcloud.net/pages';

export async function fetchPages(): Promise<Record<string, PageData>> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to fetch pages: ${res.statusText}`);
  return res.json();
}

export async function savePagesToServer(pages: Record<string, PageData>): Promise<void> {
  const userId = getTelegramUserId();
  if (!userId) {
    throw new Error('Не удалось определить пользователя Telegram. Админка доступна только в Telegram.');
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-User-Id': userId.toString(),
    },
    body: JSON.stringify(pages),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || `Failed to save pages: ${res.statusText}`);
  }
}