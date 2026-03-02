import { ADMINS } from '../config/admins';
import { getTelegramUserId } from './telegram';

export function isAdmin() {
  const userId = getTelegramUserId();
  return !!userId && ADMINS.includes(userId);
}