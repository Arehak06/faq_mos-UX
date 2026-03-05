import { loadPages } from './storage';
import { getTelegramUserId } from './telegram';
import { AdminUser } from '../types/page';

let cachedAdmins: AdminUser[] | null = null;

async function loadAdmins(): Promise<AdminUser[]> {
  if (cachedAdmins) return cachedAdmins;
  const pages = await loadPages();
  const home = pages['home'];
  cachedAdmins = home?.adminList || [];
  return cachedAdmins;
}

export async function getUserRole(): Promise<'owner' | 'admin' | 'editor' | null> {
  const userId = getTelegramUserId();
  if (!userId) return null;
  const admins = await loadAdmins();
  const user = admins.find(u => u.id === userId);
  return user?.role || null;
}

export async function isOwner(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'owner';
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'owner' || role === 'admin';
}

export async function isEditor(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'owner' || role === 'admin' || role === 'editor';
}