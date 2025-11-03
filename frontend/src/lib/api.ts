export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
export const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY ?? '';

export async function apiFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await res.json().catch(() => ({})) : await res.text();
  if (!res.ok) {
    throw { status: res.status, body };
  }
  return body;
}

export function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


