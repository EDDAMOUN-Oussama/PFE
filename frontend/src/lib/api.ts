// Vite and Vercel proxy this one browser-facing URL to VITE_API_URL.
// Keeping requests same-origin avoids third-party PHP session cookies.
const base = '/api';
export const apiUrl = (endpoint: string) => `${base}/${endpoint.replace(/^\//, '')}`;
let tokenRequest: Promise<string> | undefined;

async function csrfToken(): Promise<string> {
  if (!tokenRequest) {
    tokenRequest = fetch(apiUrl('session.php'), { credentials: 'include', cache: 'no-store' })
      .then(async response => {
        if (!response.ok) throw new Error('Session indisponible. Reessayez dans un instant.');
        const session = await response.json();
        if (typeof session.csrfToken !== 'string' || !session.csrfToken) throw new Error('Reponse de session invalide.');
        return session.csrfToken as string;
      })
      .catch(error => { tokenRequest = undefined; throw error; });
  }
  return tokenRequest;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  const method = (options.method || 'GET').toUpperCase();
  const mutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  if (mutation) headers.set('X-CSRF-Token', await csrfToken());
  const send = () => fetch(apiUrl(endpoint), { ...options, method, headers, credentials: 'include', cache: 'no-store' });
  let response = await send();
  // Retry only an explicit CSRF rejection, which occurs before any write.
  // Never retry a mutation after a server/network error.
  if (mutation && response.status === 403) {
    const error = await response.clone().json().catch(() => null);
    if (error?.code === 'csrf_expired') {
      tokenRequest = undefined;
      headers.set('X-CSRF-Token', await csrfToken());
      response = await send();
    }
  }
  if (response.status === 401) {
    tokenRequest = undefined;
    window.dispatchEvent(new Event('healthytrack:unauthorized'));
  }
  if (endpoint === 'logout.php' || endpoint === 'deleteMyCompet.php') tokenRequest = undefined;
  return response;
}

export async function api<T>(endpoint: string, body?: unknown): Promise<T> {
  const response = await apiFetch(endpoint, body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const result = await response.json().catch(() => { throw new Error('API indisponible. Patientez un instant puis reessayez.'); });
  if (!response.ok || result.success === false) throw new Error(result.message || 'La requete a echoue.');
  return result as T;
}
