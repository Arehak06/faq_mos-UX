import { ADMINS } from '../config/admins';
export function isAdmin(user) {
    return !!user?.id && ADMINS.includes(user.id);
}
