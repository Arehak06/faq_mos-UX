import { getTelegramUserId } from './telegram';

const ADMINS_KEY = 'admins';

// Инициализация при старте (можно вызвать в main.tsx)
export function initAdmins() {
  const stored = localStorage.getItem(ADMINS_KEY);
  if (!stored) {
    // Начальный список администраторов (ID владельца и других)
    const defaultAdmins = [8530682852, 1159560429]; // замените на свои ID
    localStorage.setItem(ADMINS_KEY, JSON.stringify(defaultAdmins));
  }
}

export function getAdmins(): number[] {
  const stored = localStorage.getItem(ADMINS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function setAdmins(admins: number[]) {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
}

export function isAdmin(): boolean {
  const userId = getTelegramUserId();
  if (!userId) return false;
  return getAdmins().includes(userId);
}