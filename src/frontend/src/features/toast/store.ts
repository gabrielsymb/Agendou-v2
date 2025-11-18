import { writable } from 'svelte/store';

export type ToastType = 'success'|'error'|'info';
export type ToastItem = { id: string; type: ToastType; message: string; duration?: number };

const toasts = writable<ToastItem[]>([]);

function genId(){ return `${Date.now()}-${Math.random().toString(36).slice(2)}` }

export function showToast(message: string, type: ToastType = 'info', duration = 3500){
  const id = genId();
  toasts.update(t => [...t, { id, type, message, duration }]);
  if(duration && duration>0) setTimeout(()=> removeToast(id), duration+300);
  return id;
}

export function removeToast(id: string){ toasts.update(t => t.filter(x=> x.id !== id)); }

export default toasts;
