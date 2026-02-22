export function getTelegramUser() {
  const tg = window.Telegram?.WebApp;
  return tg?.initDataUnsafe?.user;
}

export function getTelegramUserId(): number | null {
  const user = getTelegramUser();
  return user?.id || null;
}