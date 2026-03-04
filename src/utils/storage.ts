import { PageData } from '../types/page';
import { fetchPages, savePagesToServer } from '../services/pageService';

const KEY = 'pages';

// Функция для миграции данных страницы home
function migrateHomePage(pages: Record<string, PageData>): Record<string, PageData> {
  if (pages.home && !pages.home.footerSettings) {
    pages.home.footerSettings = {
      enabled: true,
      copyrightText: '',
      links: [],
    };
  }
  return pages;
}

export async function loadPages(): Promise<Record<string, PageData>> {
  try {
    const serverPages = await fetchPages();
    // Применяем миграцию
    const migrated = migrateHomePage(serverPages);
    localStorage.setItem(KEY, JSON.stringify(migrated));
    return migrated;
  } catch (e) {
    console.warn('Ошибка загрузки с сервера, используем кэш или локальный файл', e);
    const cached = localStorage.getItem(KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Применяем миграцию к кэшированным данным
      const migrated = migrateHomePage(parsed);
      // Если миграция что-то изменила, обновляем localStorage
      if (parsed !== migrated) {
        localStorage.setItem(KEY, JSON.stringify(migrated));
      }
      return migrated;
    }
    const pages = (await import('../data/pages.json')).default;
    // Применяем миграцию к данным из файла
    const migrated = migrateHomePage(pages as Record<string, PageData>);
    // Сохраняем в localStorage для будущих запусков
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