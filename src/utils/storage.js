import pages from '../data/pages.json';
const KEY = 'pages';
export function loadPages() {
    const saved = localStorage.getItem(KEY);
    if (saved)
        return JSON.parse(saved);
    return pages;
}
export function savePages(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}
