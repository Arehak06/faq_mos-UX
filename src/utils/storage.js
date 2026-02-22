import pages from '../data/pages.json';
const KEY = 'pages';
export function loadPages() {
    try {
        const saved = localStorage.getItem(KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                return parsed;
            }
        }
    }
    catch (e) {
        console.warn('Ошибка загрузки из localStorage, используем pages.json', e);
        localStorage.removeItem(KEY);
    }
    return pages;
}
// ✨ Добавьте эту функцию
export function savePages(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}
