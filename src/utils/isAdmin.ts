import { getTelegramUserId } from './telegram';
import { ADMINS } from '../config/admins';

export function isAdmin(): boolean {
  const userId = getTelegramUserId();
  return userId ? ADMINS.includes(userId) : false;
}