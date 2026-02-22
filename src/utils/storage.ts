import pages from '../data/pages.json';
import { PageData } from '../types/page';

const KEY = 'pages';

export function loadPages(): Record<string, PageData> {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Ошибка загрузки из localStorage, используем pages.json', e);
    localStorage.removeItem(KEY);
  }
  return pages as Record<string, PageData>;
}

// ✨ Добавьте эту функцию
export function savePages(data: Record<string, PageData>) {
  localStorage.setItem(KEY, JSON.stringify(data));
}