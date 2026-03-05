import { ADMINS } from '../config/admins';
import { getTelegramUserId } from './telegram';

export function isAdmin() {
  const userId = getTelegramUserId();
  console.log('Checking admin: userId =', userId);
  console.log('ADMINS list =', ADMINS);
  return !!userId && ADMINS.includes(userId);
}