

const envBase = (import.meta as any).env?.VITE_API_URL;
const BASE = envBase || (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname !== 'localhost'
  ? `http://${window.location.hostname}:4000`
  : 'http://localhost:4000'
);
const TOKEN_KEY = 'agendou_token';

// use static import to avoid runtime dynamic import resolution issues
import { showToast } from '../features/toast/store.js';

function getToken(){
  try{
    // compat: check official key first, then legacy 'token' key
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token') || null;
  }catch(e){return null}
}

import http from './http.js';

async function request(path: string, init: RequestInit = {}) {
  // Adapt to use axios instance
  const method = (init.method || 'GET').toLowerCase();
  const body = init.body;
  try {
    let resp: any;
    if (method === 'get' || method === 'delete') {
      resp = await (http as any)[method](path);
    } else {
      // post/put: pass object body directly so axios sets Content-Type
      resp = await (http as any)[method](path, body);
    }
    return resp.data !== undefined ? resp.data : resp;
  } catch (err: any) {
    // err may be normalized by interceptor
    const msg = err && (err.data?.message || err.data?.error || err.message || JSON.stringify(err));
    try{
      showToast(String(msg), 'error');
    }catch(e){/* ignore */}
    const e:any = new Error(String(msg));
    e.status = err?.status;
    e.data = err?.data;
    throw e;
  }
}

// n precisa exportar como default, pode importar assim:
// import { api } from './api'
const api = {
  get: (p: string) => request(p, { method: 'GET' }),
  post: (p: string, b?: any) => request(p, { method: 'POST', body: b }),
  put: (p: string, b?: any) => request(p, { method: 'PUT', body: b }),
  del: (p: string) => request(p, { method: 'DELETE' })
};

export { api };
export default api;