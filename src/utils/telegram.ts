const TELEGRAM_USER_KEY = 'telegram_user';

export function getTelegramUser() {
  // Приоритет: Telegram WebApp
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  // Затем localStorage (после OIDC-логина)
  const stored = localStorage.getItem(TELEGRAM_USER_KEY);
  if (stored) {
    try {
      const user = JSON.parse(stored);
      // Нормализуем: если есть sub, но нет id, создаём id = sub
      if (user && typeof user === 'object') {
        if (user.sub && !user.id) {
          user.id = parseInt(user.sub, 10);
        }
      }
      return user;
    } catch {
      return null;
    }
  }
  return null;
}
export function setTelegramUser(user: any) {
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