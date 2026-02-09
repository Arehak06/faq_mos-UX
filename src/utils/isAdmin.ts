import { ADMINS } from '../config/admins'

export function isAdmin(user?: { id?: number }) {
  return !!user?.id && ADMINS.includes(user.id)
}