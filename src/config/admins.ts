export type AdminRole = 'owner' | 'admin' | 'editor';

export interface AdminUser {
  id: number;
  role: AdminRole;
}

export const INITIAL_ADMINS: AdminUser[] = [
  { id: 8530682852, role: 'owner' },
  { id: 1159560429, role: 'editor' },
];