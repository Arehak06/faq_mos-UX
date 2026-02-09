import { ADMINS } from '../config/admins';
export function getTelegramUser() {
    return window.Telegram?.WebApp?.initDataUnsafe?.user;
}
export function isAdmin() {
    const user = getTelegramUser();
    return !!user?.id && ADMINS.includes(user.id);
}
