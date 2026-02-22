import { ADMINS } from '../config/admins';
import { getTelegramUser } from './telegram';
export function isAdmin() {
    const user = getTelegramUser();
    return !!user?.id && ADMINS.includes(user.id);
}
