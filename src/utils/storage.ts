import { PageData } from '../types/page';
import { fetchPages, savePagesToServer } from '../services/pageService';

const KEY = 'pages';

export async function loadPages(): Promise<Record<string, PageData>> {
  try {
    const serverPages = await fetchPages();
    localStorage.setItem(KEY, JSON.stringify(serverPages));
    return serverPages;
  } catch (e) {
    console.warn('Ошибка загрузки с сервера, используем кэш или локальный файл', e);
    const cached = localStorage.getItem(KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    const pages = (await import('../data/pages.json')).default;
    return pages as Record<string, PageData>;
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