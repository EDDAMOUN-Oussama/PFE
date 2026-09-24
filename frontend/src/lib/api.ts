const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
export const apiUrl = (endpoint: string) => `${base}/${endpoint.replace(/^\//, '')}`;
let tokenRequest: Promise<string> | undefined;
async function csrfToken(): Promise<string> {
  if (!tokenRequest) tokenRequest = fetch(apiUrl('session.php'), { credentials: 'include' })
    .then(async response => { if (!response.ok) throw new Error('Session indisponible.'); return (await response.json()).csrfToken as string; })
    .catch(error => { tokenRequest = undefined; throw error; });
  return tokenRequest;
}
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  if (options.method && options.method !== 'GET') headers.set('X-CSRF-Token', await csrfToken());
  const response = await fetch(apiUrl(endpoint), { ...options, headers, credentials: 'include' });
  if (response.status === 401) window.dispatchEvent(new Event('healthytrack:unauthorized'));
  if (endpoint === 'logout.php') tokenRequest = undefined;
  return response;
}
export async function api<T>(endpoint: string, body?: unknown): Promise<T> {
  const response = await apiFetch(endpoint, body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok || result.success === false) throw new Error(result.message || 'La requete a echoue.');
  return result as T;
}
