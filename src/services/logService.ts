import { getTelegramUserId } from '../utils/telegram';

const LOGS_URL = 'https://d5dfre3k7o8lq2478qsp.4b4k4pg5.apigw.yandexcloud.net/logs';

export interface LogEntry {
  timestamp: string;
  userId: number;
  action: string;
  pageId?: string;
  details?: any;
}

export async function addLog(action: string, pageId?: string, details?: any) {
  const userId = getTelegramUserId();
  if (!userId) return;

  try {
    await fetch(LOGS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-User-Id': userId.toString(),
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        userId,
        action,
        pageId,
        details,
      }),
    });
  } catch (err) {
    console.error('Failed to add log:', err);
  }
}

export async function fetchLogs(): Promise<LogEntry[]> {
  const userId = getTelegramUserId();
  if (!userId) throw new Error('Not authenticated');

  const res = await fetch(LOGS_URL, {
    headers: {
      'X-Telegram-User-Id': userId.toString(),
    },
  });
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}