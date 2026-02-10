import pages from '../data/pages.json'
import { PageData } from '../types/page'

const KEY = 'pages'

export function loadPages(): Record<string, PageData> {
  const saved = localStorage.getItem(KEY)
  if (saved) return JSON.parse(saved)
  return pages as Record<string, PageData>
}

export function savePages(data: Record<string, PageData>) {
  localStorage.setItem(KEY, JSON.stringify(data))
}
