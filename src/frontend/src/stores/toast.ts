import { writable } from 'svelte/store';

export type ToastItem = {
  id: string;
  message: string;
  type?: 'success' | 'error';
  timeout?: number;
};

function createToastStore() {
  const { subscribe, update } = writable<ToastItem[]>([]);

  function add(message: string, type: 'success' | 'error' = 'success', timeout = 4000) {
    const id = (globalThis.crypto && (globalThis.crypto as any).randomUUID)
      ? (globalThis.crypto as any).randomUUID()
      : `${Date.now()}-${Math.random()}`;
    update(s => [...s, { id, message, type, timeout }]);
    setTimeout(() => remove(id), timeout);
    return id;
  }

  function remove(id: string) {
    update(s => s.filter(t => t.id !== id));
  }

  return { subscribe, add, remove };
}

export const toasts = createToastStore();