import { getTelegramUser } from '../utils/telegram';

const LOGS_URL = 'https://d5dfre3k7o8lq2478qsp.4b4k4pg5.apigw.yandexcloud.net/logs';

export interface LogEntry {
  timestamp: string;
  userId: number;
  userName?: string;      // имя (first_name + last_name)
  username?: string;      // @username
  action: string;
  pageId?: string;
  details?: any;
}

function getUserName(): string | undefined {
  const user = getTelegramUser();
  if (!user) return undefined;
  let name = user.first_name || '';
  if (user.last_name) name += ' ' + user.last_name;
  return name.trim() || undefined;
}

function getUsername(): string | undefined {
  const user = getTelegramUser();
  return user?.username;
}

export async function addLog(action: string, pageId?: string, details?: any) {
  const user = getTelegramUser();
  if (!user) return;

  try {
    await fetch(LOGS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-User-Id': user.id.toString(),
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        userId: user.id,
        userName: getUserName(),
        username: getUsername(),
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
  const userId = getTelegramUser()?.id;
  if (!userId) throw new Error('Not authenticated');

  const res = await fetch(LOGS_URL, {
    headers: {
      'X-Telegram-User-Id': userId.toString(),
    },
  });
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}