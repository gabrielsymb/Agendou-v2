import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';
export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};

const toasts = writable<Toast[]>([]);

function genId() {
  try {
    // chrome/node modern API
    // @ts-ignore
    return (globalThis.crypto && globalThis.crypto.randomUUID && globalThis.crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  } catch (e) {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function showToast(message: string, type: ToastType = 'info', duration = 4000) {
  const id = genId();
  const toast: Toast = { id, type, message, duration };
  toasts.update((t) => [...t, toast]);
  if (duration && duration > 0) {
    setTimeout(() => removeToast(id), duration + 300);
  }
  return id;
}

function removeToast(id: string) {
  toasts.update((t) => t.filter((x) => x.id !== id));
}

export { toasts, showToast, removeToast };
