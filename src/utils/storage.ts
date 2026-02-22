import { PageData } from '../types/page';
import { fetchPages, savePagesToServer } from '../services/pageService';

const KEY = 'pages';

export async function loadPages(): Promise<Record<string, PageData>> {
  try {
    // Пробуем загрузить с сервера
    const serverPages = await fetchPages();
    // Сохраняем в localStorage как кэш
    localStorage.setItem(KEY, JSON.stringify(serverPages));
    return serverPages;
  } catch (e) {
    console.warn('Ошибка загрузки с сервера, используем кэш или локальный файл', e);
    // Пробуем взять из localStorage
    const cached = localStorage.getItem(KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    // Если нет кэша, грузим из pages.json
    const pages = (await import('../data/pages.json')).default;
    return pages as Record<string, PageData>;
  }
}

export async function savePages(data: Record<string, PageData>): Promise<void> {
  try {
    // Сохраняем на сервер
    await savePagesToServer(data);
    // Обновляем localStorage
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Ошибка сохранения на сервер', e);
    // Можно пробросить ошибку дальше, чтобы показать пользователю
    throw new Error('Не удалось сохранить изменения на сервере');
  }
}