// import { showToast } from '../features/toast/store.js'; // removido para evitar ciclo

const BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'agendou_token';

function getToken(){ try{ return localStorage.getItem(TOKEN_KEY) }catch(e){return null} }

async function request(path: string, init: RequestInit = {}) {
  const url = `${BASE}${path}`;
  const headers: Record<string,string> = { Accept: 'application/json', ...(init.headers as any) };
  if(!(init.body instanceof FormData) && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  const token = getToken(); if(token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {...init, headers});
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await res.json().catch(()=>null) : await res.text().catch(()=>null);
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