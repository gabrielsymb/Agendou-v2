<script lang="ts">
  import './app.css';
  import './styles/global.css';
  import { onMount } from 'svelte';
  import Welcome from './routes/Welcome.svelte';
  import Login from './routes/Login.svelte';
  import Register from './routes/Register.svelte';
  import Home from './routes/Home.svelte';
  import ToastContainer from './features/toast/ToastContainer.svelte';

  const routes: Record<string, any> = {
    '/': Welcome,
    '/login': Login,
    '/register': Register,
    '/home': Home,
  };

  let Component: any = Welcome;

  function resolve() {
    const path = location.pathname || '/';
    Component = routes[path] ?? Welcome;
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

    console.log('[app] App mounted, initial route ->', location.pathname, 'resolved component ->', Component && Component.name);

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

<ToastContainer />
<main class="min-vh-100 bg-light">
  <svelte:component this={Component} />
</main>