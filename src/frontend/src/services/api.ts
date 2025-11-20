// import { showToast } from '../features/toast/store.js'; // removido para evitar ciclo

const envBase = (import.meta as any).env?.VITE_API_URL;
// If VITE_API_URL is set use it. Otherwise, when the app is accessed over the network
// (e.g. http://10.0.0.100:5173) build the backend URL using the same hostname and
// the backend port (4000). This lets mobile devices talk to the local dev backend
// without editing env files. Fall back to localhost for other cases.
const BASE = envBase || (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname !== 'localhost'
  ? `http://${window.location.hostname}:4000`
  : 'http://localhost:4000'
);
const TOKEN_KEY = 'agendou_token';

function getToken(){
  try{
    // compat: check official key first, then legacy 'token' key
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token') || null;
  }catch(e){return null}
}

async function request(path: string, init: RequestInit = {}) {
  const url = `${BASE}${path}`;
  const headers: Record<string,string> = { Accept: 'application/json', ...(init.headers as any) };
  if(!(init.body instanceof FormData) && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  const token = getToken(); if(token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {...init, headers});
  const ct = res.headers.get('content-type') || '';
  // Ler o corpo uma vez como texto e tentar parsear JSON manualmente.
  // Isso evita chamadas duplicadas a res.json()/res.text() que podem falhar se o stream já foi lido.
  let rawBody: string | null = null;
  try {
    rawBody = await res.text();
  } catch (e) {
    rawBody = null;
  }

  let data: any = null;
  if (rawBody) {
    // Se o content-type indica JSON, ou o corpo parece JSON, tente parsear.
    const looksLikeJson = ct.includes('application/json') || rawBody.trim().startsWith('{') || rawBody.trim().startsWith('[');
    if (looksLikeJson) {
      try {
        data = JSON.parse(rawBody);
      } catch (e) {
        // Não foi possível parsear: deixar rawBody para inspeção
        data = rawBody;
      }
    } else {
      data = rawBody;
    }
  }
  if(!res.ok){
    const msg = (data && ((data as any).message || (data as any).error)) || res.statusText;
    // import dinâmico para evitar ciclo de importação no momento da inicialização
    try{
      const toastMod = await import('../features/toast/store.js');
      if (toastMod && typeof toastMod.showToast === 'function') {
        toastMod.showToast(String(msg), 'error');
      }
    }catch(e){
      // silêncio: se falhar ao carregar toast, não impedir erro principal
    }
    const err:any = new Error(String(msg));
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// n precisa exportar como default, pode importar assim:
// import { api } from './api'
const api = {
  get: (p: string) => request(p, { method: 'GET' }),
  post: (p: string, b?: any) => request(p, { method: 'POST', body: b ? JSON.stringify(b) : undefined }),
  put: (p: string, b?: any) => request(p, { method: 'PUT', body: b ? JSON.stringify(b) : undefined }),
  del: (p: string) => request(p, { method: 'DELETE' })
};

export { api };
export default api;