export function navigate(path: string) {
  // normalize path
  const p = path.startsWith('/') ? path : `/${path}`;
  history.pushState({}, '', p);
  // dispara popstate para o roteador escutar
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function replace(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  history.replaceState({}, '', p);
  window.dispatchEvent(new PopStateEvent('popstate'));
}