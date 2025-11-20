import { writable } from 'svelte/store';

export type ToastType = 'success'|'error'|'info';
export type ToastItem = { id: string; type: ToastType; message: string; duration?: number };

const toasts = writable<ToastItem[]>([]);

// map to keep timeouts so we can clear/reset them when needed
const timers = new Map<string, number>();

function genId(){ return `${Date.now()}-${Math.random().toString(36).slice(2)}` }

/**
 * Show a toast. Prevents exact-duplicate error toasts by message+type.
 * If a duplicate is detected, its timeout is reset instead of adding a new one.
 */
export function showToast(message: string, type: ToastType = 'info', duration = 3500){
  const raw = (message ?? '').toString();
  const trimmed = raw.trim();
  if(!trimmed) return undefined;
  // normalize: lowercase, collapse spaces, remove accents to avoid near-duplicates
  const normalized = trimmed
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ');
  // dedupe key
  const key = `${type}::${normalized}`;

  // if there's already a toast with same key, reset its timer and return existing id
  let existingId: string | undefined;
  toasts.update(list => {
    const found = list.find(x => {
      const msg = (x.message ?? '').toString().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ');
      return `${x.type}::${msg}` === key;
    });
    if(found){ existingId = found.id; return list; }
    const id = genId();
    return [...list, { id, type, message: trimmed, duration }];
  });

  if(existingId){
    // reset existing timer
    const prev = timers.get(existingId);
    if(prev) clearTimeout(prev as unknown as number);
    if(duration && duration>0){
      const t = setTimeout(()=> removeToast(existingId!), duration+300);
      timers.set(existingId, t as unknown as number);
    }
    return existingId;
  }

  // new toast: find its id from store (last item)
  let newId: string | undefined;
  toasts.update(list => { newId = list.length ? list[list.length-1].id : undefined; return list; });

  if(newId && duration && duration>0){
    const t = setTimeout(()=> removeToast(newId!), duration+300);
    timers.set(newId, t as unknown as number);
  }

  return newId;
}

export function removeToast(id: string){
  // clear any pending timer
  const t = timers.get(id);
  if(t) clearTimeout(t as unknown as number);
  timers.delete(id);
  toasts.update(tlist => tlist.filter(x=> x.id !== id));
}

export default toasts;
