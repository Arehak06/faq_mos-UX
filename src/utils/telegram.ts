export function getTelegramUser() {
  const tg = window.Telegram?.WebApp;
  return tg?.initDataUnsafe?.user;
}