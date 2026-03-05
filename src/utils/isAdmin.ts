import { getTelegramUserId } from './telegram';
import { AdminUser, INITIAL_ADMINS, AdminRole } from '../config/admins';

const ADMINS_KEY = 'admins';
const USER_DATA_PREFIX = 'telegram_user_';

// Сохранить данные пользователя (вызывается при входе)
export function saveTelegramUserData(user: any) {
  if (user?.id) {
    localStorage.setItem(`${USER_DATA_PREFIX}${user.id}`, JSON.stringify(user));
  }
}

// Получить данные пользователя по ID
export function getTelegramUserData(id: number): any | null {
  const data = localStorage.getItem(`${USER_DATA_PREFIX}${id}`);
  return data ? JSON.parse(data) : null;
}

// Инициализация списка администраторов (вызывается в main.tsx)
export function initAdmins() {
  const stored = localStorage.getItem(ADMINS_KEY);
  if (!stored) {
    localStorage.setItem(ADMINS_KEY, JSON.stringify(INITIAL_ADMINS));
  }
}

export function getAdmins(): AdminUser[] {
  const stored = localStorage.getItem(ADMINS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function setAdmins(admins: AdminUser[]) {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
}

export function isAdmin(): boolean {
  const userId = getTelegramUserId();
  if (!userId) return false;
  const admins = getAdmins();
  return admins.some(a => a.id === userId);
}

export function getUserRole(): AdminRole | null {
  const userId = getTelegramUserId();
  if (!userId) return null;
  const admins = getAdmins();
  const user = admins.find(a => a.id === userId);
  return user?.role || null;
}