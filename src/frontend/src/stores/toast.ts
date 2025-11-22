// Facade: delegate to the single feature-level toast store so all parts of the app
// use the same underlying writable. This keeps existing `toasts.add/remove` calls
// working while centralizing events created via `showToast`.
import toastsDefault, { showToast, removeToast } from '../features/toast/store.js';

export const toasts = {
  subscribe: toastsDefault.subscribe,
  add: showToast,
  remove: removeToast,
};