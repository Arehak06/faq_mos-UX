export type AdminRole = 'owner' | 'admin' | 'editor';

export interface AdminUser {
  id: number;
  role: AdminRole;
}

export const ADMINS: AdminUser[] = [
  { id: 8530682852, role: 'owner' },
  { id: 1087619106, role: 'admin' },
  
];