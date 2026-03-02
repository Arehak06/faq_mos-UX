import { TelegramLoginWidgetData } from '@advanceddev/telegram-login-react';

const TELEGRAM_USER_KEY = 'telegram_user';

export function getTelegramUser(): TelegramLoginWidgetData | null {
  // Приоритет: Telegram WebApp
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  // Затем localStorage (для обычного браузера)
  const stored = localStorage.getItem(TELEGRAM_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export function setTelegramUser(user: TelegramLoginWidgetData) {
  localStorage.setItem(TELEGRAM_USER_KEY, JSON.stringify(user));
}

export function clearTelegramUser() {
  localStorage.removeItem(TELEGRAM_USER_KEY);
}

export function getTelegramUserId(): number | null {
  const user = getTelegramUser();
  return user?.id || null;
}

export function getTelegramUserName(): string | undefined {
  const user = getTelegramUser();
  if (!user) return undefined;
  let name = user.first_name || '';
  if (user.last_name) name += ' ' + user.last_name;
  return name.trim() || undefined;
}