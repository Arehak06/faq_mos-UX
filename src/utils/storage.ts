import initialPages from '../data/pages.json'

const KEY = 'pages_data'

export function loadPages() {
  const saved = localStorage.getItem(KEY)
  return saved ? JSON.parse(saved) : initialPages
}

export function savePages(data: any) {
  localStorage.setItem(KEY, JSON.stringify(data))
}
