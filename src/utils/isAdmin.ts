import { ADMINS } from '../config/admins';
import { getTelegramUserId } from './telegram';

export function isAdmin() {
  const userId = getTelegramUserId();
  if (!userId) return false;
  return ADMINS.includes(Number(userId));
}