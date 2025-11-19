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
    resolve();
    window.addEventListener('popstate', resolve);
    return () => window.removeEventListener('popstate', resolve);
  });
  console.log('[app] App mounted, initial route ->', location.pathname, 'resolved component ->', Component && Component.name)
</script>

<ToastContainer />
<main class="min-vh-100 bg-light">
  <svelte:component this={Component} />
</main>