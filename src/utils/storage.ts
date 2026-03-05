import { PageData } from '../types/page';
import { fetchPages, savePagesToServer } from '../services/pageService';

const KEY = 'pages';

// Миграция: если есть статический список админов, переносим в home.adminList
async function migrateAdmins(pages: Record<string, PageData>): Promise<Record<string, PageData>> {
  if (pages.home && !pages.home.adminList) {
    try {
      const { ADMINS } = await import('../config/admins');
      if (ADMINS && ADMINS.length) {
        // ADMINS уже содержит корректный массив AdminUser, просто присваиваем
        pages.home.adminList = ADMINS;
      }
    } catch (e) {
      console.warn('Failed to import static admins', e);
    }
  }
  return pages;
}

export async function loadPages(): Promise<Record<string, PageData>> {
  try {
    const serverPages = await fetchPages();
    const migrated = await migrateAdmins(serverPages);
    localStorage.setItem(KEY, JSON.stringify(migrated));
    return migrated;
  } catch (e) {
    console.warn('Ошибка загрузки с сервера, используем кэш или локальный файл', e);
    const cached = localStorage.getItem(KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const migrated = await migrateAdmins(parsed);
      if (parsed !== migrated) {
        localStorage.setItem(KEY, JSON.stringify(migrated));
      }
      return migrated;
    }
    const pages = (await import('../data/pages.json')).default;
    const migrated = await migrateAdmins(pages as Record<string, PageData>);
    localStorage.setItem(KEY, JSON.stringify(migrated));
    return migrated;
  }
}

export async function savePages(data: Record<string, PageData>): Promise<void> {
  try {
    await savePagesToServer(data);
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Ошибка сохранения на сервер', e);
    throw new Error('Не удалось сохранить изменения на сервере');
  }
}