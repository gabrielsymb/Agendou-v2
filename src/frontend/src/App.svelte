<script lang="ts">
  import './app.css';
  import './global.css';
  import { onMount } from 'svelte';
  // LayoutContainer removed: global layout now handled by global.css
    import Header from './components/layout/Header.svelte';
    import { auth } from './lib/stores/auth';
  import TabBar from './components/nav/TabBar.svelte';
  import { navigate } from './lib/router';
  import Welcome from './routes/Welcome.svelte';
  import * as Login from './routes/Login.svelte';
  import * as Register from './routes/Register.svelte';
  import * as Home from './routes/Home.svelte';
  import * as TestPage from './routes/TestPage.svelte';
  import * as Settings from './routes/Settings.svelte';
  import ToastContainer from './features/toast/ToastContainer.svelte';

  const routes: Record<string, any> = {
    '/': Welcome,
    '/login': (Login as any).default ?? Login,
    '/register': (Register as any).default ?? Register,
  '/home': (Home as any).default ?? Home,
  '/calendar': (Home as any).default ?? Home, /* fallback to Home until Calendar exists */
  '/test': (TestPage as any).default ?? TestPage,
  '/settings': (Settings as any).default ?? Settings,
  };

  let Component: any = Welcome;
  let currentPath = '/';
    let token: string | null = null;
    const unsubscribeAuth = auth.token.subscribe((t: string | null) => token = t);

  const tabItems = [
    { id: 'home', label: 'Início', path: '/home', icon: 'material-symbols:home-rounded' },
    { id: 'calendar', label: 'Agenda', path: '/calendar', icon: 'material-symbols:event-rounded' },
    { id: 'profile', label: 'Perfil', path: '/settings', icon: 'material-symbols:settings-rounded' }
  ];
  let activeIndex = 0;

  function resolveActiveIndex(path: string) {
    const p = path || '/';
    const idx = tabItems.findIndex(it => it.path === p);
    return idx >= 0 ? idx : 0;
  }

  function handleTabTap(e: CustomEvent) {
    const i = e.detail?.index ?? 0;
    const it = tabItems[i];
    if (it && it.path) {
      navigate(it.path);
      activeIndex = i;
    }
  }

  function resolve() {
    const path = location.pathname || '/';
    Component = routes[path] ?? Welcome;
  currentPath = path;
  activeIndex = resolveActiveIndex(currentPath);
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

  if (import.meta.env.MODE !== 'production' && import.meta.env.VITE_DEBUG === '1') {
    console.log('[app] App mounted, initial route ->', location.pathname, 'resolved component ->', Component ? (Component.name ?? 'component') : 'none');
  }

    return () => {
        unsubscribeAuth();
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

    {#if currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register'}
  <Header />
  <div style="height: var(--layout-header-height);"></div>
    {/if}
  <main class="bg-light"
    style="padding-bottom: calc(var(--component-tabbar-height, 64px) + 16px);
           box-sizing: border-box;
           overflow-y: auto;">
    {#if currentPath === '/home' || currentPath === '/calendar'}
      <!-- Render home/calendar full-bleed between header and TabBar -->
      <div>
        <svelte:component this={Component} />
      </div>
    {:else}
      <div class="layout-root">
        <div class="layout-container">
          <div class="layout-body">
            <svelte:component this={Component} />
          </div>
        </div>
      </div>
    {/if}
  </main>

  {#if currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register'}
  <TabBar items={tabItems} bind:activeIndex on:tabtap={handleTabTap} />
  {/if}

<ToastContainer />