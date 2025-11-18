// runtime shim: dynamically import the real module (Vite will resolve ./api -> ./api.ts)
const mod = await import('./api');
export const api = mod.api;
