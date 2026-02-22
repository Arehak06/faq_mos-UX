import { PageData } from '../src/types/page';

// Укажите ваш URL от API Gateway
const API_URL = 'https://d5dfre3k7o8lq2478qsp.4b4k4pg5.apigw.yandexcloud.net/pages';

export async function fetchPages(): Promise<Record<string, PageData>> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch pages from server');
  return res.json();
}

export async function savePagesToServer(pages: Record<string, PageData>): Promise<void> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pages),
  });
  if (!res.ok) throw new Error('Failed to save pages to server');
}