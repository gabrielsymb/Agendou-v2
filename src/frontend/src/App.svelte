<script lang="ts">
  import './app.css';
  import './styles/global.css';
  import { onMount } from 'svelte';
  import LayoutContainer from './components/layout/LayoutContainer.svelte';
  import Welcome from './routes/Welcome.svelte';
  import * as Login from './routes/Login.svelte';
  import * as Register from './routes/Register.svelte';
  import * as Home from './routes/Home.svelte';
  import * as Settings from './routes/Settings.svelte';
  import ToastContainer from './features/toast/ToastContainer.svelte';

  const routes: Record<string, any> = {
    '/': Welcome,
    '/login': (Login as any).default ?? Login,
    '/register': (Register as any).default ?? Register,
  '/home': (Home as any).default ?? Home,
  '/calendar': (Home as any).default ?? Home, /* fallback to Home until Calendar exists */
  '/settings': (Settings as any).default ?? Settings,
  };

  let Component: any = Welcome;
  let currentPath = '/';

  function resolve() {
    const path = location.pathname || '/';
    Component = routes[path] ?? Welcome;
  currentPath = path;
  }

  onMount(() => {
    // routing
    resolve();
    const onPop = () => resolve();
    window.addEventListener('popstate', onPop);

    // registrar service worker (se existir em public/sw.js)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // listeners globais (double click / copiar/colar / contextmenu / seleção)
    const prevent = (e: Event) => e.preventDefault();
    const preventClipboard = (e: ClipboardEvent) => e.preventDefault();
    const preventDbl = (e: MouseEvent) => e.preventDefault();

    document.addEventListener('dblclick', preventDbl, { passive: false });
    document.addEventListener('copy', preventClipboard);
    document.addEventListener('cut', preventClipboard);
    document.addEventListener('paste', preventClipboard);
    document.addEventListener('contextmenu', prevent, { passive: false });
    document.addEventListener('selectstart', prevent, { passive: false });

  console.log('[app] App mounted, initial route ->', location.pathname, 'resolved component ->', Component ? (Component.name ?? 'component') : 'none');

    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('dblclick', preventDbl);
      document.removeEventListener('copy', preventClipboard);
      document.removeEventListener('cut', preventClipboard);
      document.removeEventListener('paste', preventClipboard);
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('selectstart', prevent);
    };
  });
</script>

  <main class="min-vh-100 bg-light">
    <LayoutContainer showTabbar={currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register'}>
      <svelte:component this={Component} />
    </LayoutContainer>
  </main>

<ToastContainer />