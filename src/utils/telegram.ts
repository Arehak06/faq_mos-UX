export function getTelegramUser() {
  const tg = window.Telegram?.WebApp;
  return tg?.initDataUnsafe?.user;
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