import axios from 'axios';

const base = (import.meta as any).env?.VITE_API_URL || (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname !== 'localhost'
  ? `http://${window.location.hostname}:4000`
  : 'http://localhost:4000'
);

const http = axios.create({
  baseURL: base,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

// Request interceptor: injeta Authorization automaticamente
http.interceptors.request.use((cfg: any) => {
  try {
    let token = localStorage.getItem('agendou_token') || localStorage.getItem('token');
    if (token) {
      token = String(token).replace(/^Bearer\s+/i, ''); // evita "Bearer Bearer..."
      cfg.headers = cfg.headers || {};
      (cfg.headers as any)['Authorization'] = `Bearer ${token}`;
      // também define no defaults do axios instance para robustez
      (http.defaults.headers as any).common = (http.defaults.headers as any).common || {};
      (http.defaults.headers as any).common['Authorization'] = `Bearer ${token}`;
    } else {
      // garante que não haja header residual
      try { if ((http.defaults.headers as any).common) delete (http.defaults.headers as any).common['Authorization']; } catch(e){}
    }
  } catch (e) {
    // ignore
  }
  return cfg;
});

// Response interceptor: normaliza erros
http.interceptors.response.use(
  r => r,
  err => {
    if (err.response) {
      const payload = {
        status: err.response.status,
        data: err.response.data,
      };
      return Promise.reject(payload);
    }
    return Promise.reject({ message: err.message });
  }
);

export default http;
